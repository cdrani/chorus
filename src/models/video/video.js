import VideoOverride from './video-override.js'

export default class VideoElement {
    constructor({ video, reverb }) {
        this._video = video
        this._reverb = reverb
        this._video.crossOrigin = 'anonymous'
        this._videoOverride = new VideoOverride(this)
    }

    set active(value) {
        this._active = value
        if (navigator.userAgent.includes('Firefox')) return

        const effect = sessionStorage.getItem('reverb') ?? 'none'
        const reverbEffect = this._reverb.isAPreset(effect) ? effect : 'none'

        this._reverb.setReverbEffect(value ? reverbEffect : 'none')
    }

    get active() {
        return this._active
    }

    reset() {
        this.clearCurrentSpeed()
        this.resetTempTimes()
        this.playbackRate = 1
        this.preservesPitch = true
    }

    resetTempTimes() {
        this._video.removeAttribute('endTime')
        this._video.removeAttribute('startTime')
        this._video.removeAttribute('lastSetThumb')
    }

    get element() {
        return this._video
    }

    set currentTime(value) {
        if (this._video) this._video.currentTime = value
    }

    get currentTime() {
        return this._video?.currentTime
    }

    clearCurrentSpeed() {
        this._video.removeAttribute('currentSpeed')
    }

    set preservesPitch(value) {
        if (this._video) this._video.preservesPitch = value
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
        this._video.playbackRate = this._active ? { source: 'chorus', value } : value
    }

    get playbackRate() {
        return this._video ? this._video.playbackRate : 1
    }
}
