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
        this._playedSnip = false
        this._currentSongState = null
        this._video = spotifyVideo.element
    }

    async init() {
        this.#setupListeners()
        const songStateData = await this.#setCurrentSongData()
        songStateData.isShared 
            ? await this.handleShared(songStateData)
            : await this.songChange(songStateData)
    }

    async handleShared(songStateData) {
        await this.#applyEffects(songStateData)
        const { startTime: position } = songStateData
        const trackId = location.pathname?.split('/')?.at(-1)
        this._video.currentTime = position
        this.#mute()
        await PlayerService.play({ trackId, position, cb: () => this.#requestCallback(500) })
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

    #requestCallback = (duration = 1000) => {
        this.#mute()
        setTimeout(() => this.#unMute(), duration) 
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

    async songChange(initialData = null) {
        this.#mute()


        const songStateData = initialData ?? await this.#setCurrentSongData()
        await this.#applyEffects(songStateData)
        const { isShared, isSnip, isSkipped, startTime } = songStateData

        if (isShared && location?.search) history.pushState(null, '', location.pathname)

        if (isSkipped) {
            return this.#nextButton.click()
        } else if (isSnip) {
            const parsedStartTime = parseInt(startTime, 10) * 1000
            const currentPosition = timeToSeconds(this.#playbackPosition?.textContent || '0:00')
            const currentPositionTime = parseInt(currentPosition, 10) * 1000

            if (parsedStartTime != 0 && currentPositionTime < parsedStartTime) {
                this._video.currentTime = startTime
            } 
        }

        this.#unMute()
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

        setTimeout(async () => {
            const { isShared, startTime, endTime } = this._currentSongState
            const currentTimeMS = parseInt(this._video.currentTime * 1000, 10)

            const isSongEnd = endTime == playback.duration()
            const endTimeMS = parseInt(endTime, 10) * 1000 - (isSongEnd ? 100 : 0)
            const atSongEnd = currentTimeMS >= endTimeMS
            if (!atSongEnd) return

            if (this.#isLooping || isShared) {
                return (this._video.currentTime = startTime)
            }

            this.#nextButton.click()
        }, 1000)
    }
}
