import { currentData } from '../../data/current.js'
import { songState } from '../../data/song-state.js'

import VideoOverride from './video-override.js'

export default class VideoElement {
    constructor(video) {
        this._video = video
        this._currentTrackId = null
        this.#listenForTrackChange()
        this._active = sessionStorage.getItem('enabled') == 'true'

        this._videoOverride = new VideoOverride(this)
    }

    set active(value) {
        this._active = value
    }

    get active() {
        return this._active
    }

    async activate() {
        await this.#handleTrackChange()
    }

    reset() {
        this.clearCurrentSpeed()
        this.playbackRate = 1
        this.preservesPitch = true
    }

    get element() {
        return this._video
    }

    set currentTime(value) {
        if (this._video) {
            this._video.currentTime = value
        }
    }

    get currentTime() {
        return this._video?.currentTime
    }

    clearCurrentSpeed() {
        this._video.removeAttribute('currentSpeed') 
    }

    set preservesPitch(value) {
        if (this._video) {
            this._video.preservesPitch = value
        }
    }

    get currentSpeed() {
        return this._video.getAttribute('currentSpeed')
    }

    set currentSpeed(value) {
        this._video.setAttribute('currentSpeed', value)
    }

    get preservesPitch() {
        return this._video ? this._video.preservesPitch : true
    }

    set playbackRate(value) {
        if (this._active) {
            this._video.playbackRate = { source: 'chorus', value: value }
        } else {
            this._video.playbackRate = value
        }
    }

    get playbackRate() {
        return this._video ? this._video.playbackRate : 1
    }

    async #handleTrackChange() {
        if (!this.active) return
        if (!this.#isMuted) this.#muteButton.click()

        const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
        const { isSnip, trackId, isSkipped, startTime, isShared, playbackRate, preservesPitch } = await songState()

        this.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch

        const sameSong = !!this._currentTrackId && (trackId == this._currentTrackId)
        if (sameSong) return

        if (isSkipped) {
            document.querySelector('[data-testid="control-button-skip-forward"]')?.click()
            return
        } else if (isSnip || isShared) {
            this._video.currentTime = { source: 'chorus', value: startTime }
        } else {
            this._video.play()
        }
        this._currentTrackId = trackId
    }

    #listenForTrackChange() {
        this._video.addEventListener('loadeddata', async () => {
            await this.#handleTrackChange()
        })
    }

    get #muteButton() {
        return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]')
    }

    get #isMuted() {
        return this.#muteButton?.getAttribute('aria-label') == 'Unmute'
    }
}