import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { playback } from '../utils/playback.js'
import { timeToSeconds } from '../utils/time.js'
import { currentSongInfo } from '../utils/song.js'
import { highlightElement } from '../utils/higlight.js'

import { PlayerService } from '../services/player.js'

export default class SongTracker {
    constructor() {
        this._init = true
        this._currentSongState = null
        this._video = spotifyVideo.element
    }

    async init() {
        this.#setupListeners()
        const songStateData = await this.#setCurrentSongData()
        if (songStateData.isShared) await this.handleShared(songStateData)
    }

    async updateCurrentSongData(values) {
        if (!values) return

        this._currentSongState = { ...this._currentSongState || {}, ...values }
        await this.#applyEffects(this._currentSongState)
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }

    async #seekTo(position) {
        await PlayerService.seekTo({ position, cb: () => this.#requestCallback(1000) })
    }

    async #playFrom(position) {
        const { trackId } = currentSongInfo()
        await PlayerService.play({ trackId, position, cb: () => this.#requestCallback(250) })
    }

    #requestCallback = (duration = 1000) => {
        this.#mute()
        setTimeout(() => { console.log('unmuting'); this.#unMute() }, duration) 
    }

    get #muteButton() {
        return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]')
    }

    get #isMute() {
        return this.#muteButton?.getAttribute('aria-label') == 'Unmute'
    }

    #mute() { if (!this.#isMute) this.#muteButton?.click() }
    #unMute() { if (this.#isMute) this.#muteButton?.click() }

    #setupListeners() {
        this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate)
    }

    clearListeners() {
        this._video.element.removeEventListener('timeupdate', this.#handleTimeUpdate)
    }

    async #applyEffects({ isShared, isSnip, playbackRate, preservesPitch }) {
        const { preferredRate, preferredPitch, track } = await currentData.getPlaybackValues()
        this._video.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this._video.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch

        highlightElement({ 
            selector: '#chorus-icon > svg', 
            songStateData: { isSnip, isShared, ...track }
        })
    }

    async #setCurrentSongData() {
        const songStateData = await songState()
        const songInfo = { ...songStateData, ...currentSongInfo() }
        this._currentSongState = songInfo
        return songInfo
    }

    async handleShared(songStateData) {
        await this.#applyEffects(songStateData)
        await this.#playFrom(songStateData.startTime)
    }

    async songChange(initialData = null) {
        if (!this._init) { this.#mute(); }

        const songStateData = initialData ?? await this.#setCurrentSongData()
        await this.#applyEffects(songStateData)
        const { isSnip, isSkipped, startTime, isShared } = songStateData

        if (isSkipped) {
            this.#nextButton.click()
            return
        } else if (isSnip || isShared) {
            const parsedStartTime = parseInt(startTime, 10) * 1000
            const currentPosition = timeToSeconds(this.#playbackPosition?.textContent || '0:00')
            const currentPositionTime = parseInt(currentPosition, 10) * 1000

            if (parsedStartTime != 0 && currentPositionTime < parsedStartTime) {
                await this.#playFrom(startTime)
            } 
        }

        if (!this._init) this.#unMute()
        this._init = false
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    #handleTimeUpdate = () => {
        if (this._video.isEditing) return
        if (!this._currentSongState) return

        setTimeout(() => {
            const { startTime, endTime } = this._currentSongState
            const currentTimeMS = parseInt(this._video.currentTime * 1000, 10)

            const isSongEnd = endTime == playback.duration()
            const endTimeMS = parseInt(endTime, 10) * 1000 - (isSongEnd ? 100 : 0)
            const atSongEnd = currentTimeMS >= endTimeMS
            if (!atSongEnd) return

            if (this.#isLooping) {
                this._video.currentTime = startTime
                return
            }

            if (location?.search) history.pushState(null, '', location.pathname)
            this.#nextButton.click()
        }, 1000)
    }
}
