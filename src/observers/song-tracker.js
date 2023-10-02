import { request } from '../utils/request.js'
import { playback } from '../utils/playback.js'
import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { highlightElement } from '../utils/higlight.js'
import { secondsToTime } from '../utils/time.js'

export default class SongTracker {
    constructor() {
        this._timeout = null
        this._currentTrackId = null
        this._currentSongState = null
        this._video = spotifyVideo.element
    }

    async init() {
        await this.#setSharedState()
        await this.songChange()
        this.#setupListeners()
    }

    get #isPaused() {
        return this._video.element.paused
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        if (this.#isPaused) playButton?.click()
    }

    set currentSongState(values) {
        if (!values) return

        this._currentSongState = {
            ...this._currentSongState,
            ...values,
        }
    }

    async #setSharedState() {
        this.#mute()
        const { isShared, startTime, playbackRate = 1, preservesPitch = true } = await songState()

        this._video.playbackRate = playbackRate
        this._video.preservesPitch = preservesPitch
        if (!isShared) return

        this.#handleShared(startTime)
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }

    async #seekTo(position) {
        await request({ 
            type: 'seek',
            value: Math.max(parseInt(position, 10) - 1, 1) * 1000,
        })
    }

    #handleShared(startTime) {
        this.#mute()
        this._video.currentTime = { source: 'chorus', value: startTime }
        this.#playTrack()
        setTimeout(async () => await this.#seekTo(startTime), 1000)
    }

    #mute() { this._video.volume = 0 }

    #play = () => {
        this.#mute()
        setTimeout(() => this._video.volume = 1, 2000)
    }

    #setupListeners() {
        this._video.element.addEventListener('play', this.#play, false)
        this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate)
    }

    clearListeners() {
        this._video.element.removeEventListener('play', this.#play, false)
        this._video.element.removeEventListener('timeupdate', this.#handleTimeUpdate)
    }

    #clearHistory(isShared) {
        if (!isShared && location?.search) {
            history.pushState(null, '', location.pathname)
        }
    }

    async #applyEffects({ isShared, playbackRate, preservesPitch }) {
        const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
        this._video.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this._video.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch
    }

    async #setCurrentSongData() {
        const songStateData = await songState()
        this._currentSongState = songStateData
        return songStateData
    }

    async songChange() {
        const PREV_TRACKID = this._currentTrackId
        this._video.pause()

        const songStateData = await this.#setCurrentSongData()
        const { isSnip, trackId, isSkipped, startTime, isShared } = songStateData
        this.#clearHistory()

        await this.#applyEffects(songStateData)

        if (PREV_TRACKID == this._currentSongState?.trackId) {
            if (isSkipped)  {
                this.#nextButton.click()
                return
            }

            if (isSnip) this._video.currentTime = { source: 'chorus', value: startTime }
            return
        }

        if (isSkipped) {
            this.#nextButton.click()
            return
        } else if (isSnip || isShared) {
            await this.#seekTo(startTime)
        }

        this._video.play()
        highlightElement({ selector: '#chorus-icon > svg', songStateData })
        this._currentTrackId = trackId
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    #handleTimeUpdate = () => {
        if (this._video.isEditing) return
        if (!this._currentSongState) return

        setTimeout(() => {
            const currentTime = parseInt(this._video.currentTime, 10)
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
        }, 1000)
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }
}
