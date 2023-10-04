import { request } from '../utils/request.js'
import { playback } from '../utils/playback.js'
import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { highlightElement } from '../utils/higlight.js'
import { secondsToTime, timeToSeconds } from '../utils/time.js'

export default class SongTracker {
    constructor() {
        this._currentSongState = null
        this._video = spotifyVideo.element
    }

    async init() {
        this.#setupListeners()
        await this.songChange()
    }

    set currentSongState(values) {
        if (!values) return
        if (!this._currentSongState) return

        this._currentSongState = {
            ...this._currentSongState,
            ...values,
        }
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }

    async #seekTo(position) {
        await request({ 
            type: 'seek',
            value: Math.max(parseInt(position, 10), 1) * 1000,
            cb: () => { this.#mute() }
        })
        await request({
            type: 'play',
            value: Math.max(parseInt(position, 10), 1) * 1000,
            cb: () => { this.#mute() }
        })
    }

    #mute() { this._video.volume = 0 }

    #play = () => {
        if (!this.currentSongState) return

        const { startTime, isSnip, isShared } = this._currentSongState
        const currentTime = parseInt(this._video.currentTime, 10)
        const parsedStartTime = parseInt(startTime, 10)

        this.#mute()
        const unMute = (isSnip || isShared) && currentTime < parsedStartTime

        if (unMute) {
            setTimeout(() => this._video.volume = 1, 2000)
        }
    }

    #setupListeners() {
        this._video.element.addEventListener('canplaythrough', this.#play, false)
        this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate)
    }

    clearListeners() {
        this._video.element.removeEventListener('canplaythrough', this.#play, false)
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
        this._currentSongState = songStateData
        return songStateData
    }

    async songChange() {
        this.#mute()
        this._video.pause()

        const songStateData = await this.#setCurrentSongData()
        await this.#applyEffects(songStateData)
        const { isSnip, isSkipped, startTime, isShared } = songStateData

        if (isSkipped) {
            this.#nextButton.click()
            return
        } else if (isSnip || isShared) {
            const parsedStartTime = parseInt(startTime, 10)
            const currentPositionTime = timeToSeconds(this.#playbackPosition?.textContent || '0:00')

            if (currentPositionTime < parsedStartTime) {
                await this.#seekTo(startTime)
            }
        }

        this._video.play()
        this._video.volume = 1
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
            const currentTime = parseInt(this._video.currentTime, 10)
            const startTime = parseInt(this._currentSongState.startTime, 10)

            this.#playbackPosition.textContent = secondsToTime(currentTime)

            const endTime = this?._currentSongState?.endTime ?? playback.duration()

            const atSongEnd = parseInt(this._video.currentTime, 10) >= parseInt(endTime, 10) - 1
            if (!atSongEnd) return

            if (this.#isLooping) {
                this._video.currentTime = { source: 'chorus', value: startTime }
                return
            }

            this.#mute()
            this.#nextButton.click()
            this.#mute()
        }, 1000)
    }
}
