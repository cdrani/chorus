class VideoElement {
    constructor(video) {
        this._video = video
    }

    get id() {
        const songName = document.querySelector('[data-testid="now-playing-widget"]')?.ariaLabel

        // Remove 'Now playing: ' prefix
        return songName?.split(': ')?.at(1)
    }

    get element() {
        return this._video
    }

    get attributes() {
        return {
            isSnip: this._video.getAttribute('isSnip'),
            endTime: this._video.getAttribute('endTime'),
            startTime: this._video.getAttribute('startTime'),
        }
    }

    setAttributes({ isSnip, endTime, startTime }) {
        const current = playback.current()
        const duration = playback.duration()

        this._video.currentTime = startTime ?? current ?? 0

        this._video.setAttribute('isSnip', isSnip)
        this._video.setAttribute('endTime', endTime ?? duration)
        this._video.setAttribute('startTime', startTime ?? current ?? 0)
    }

    // TODO: Don't really require these methods. The properties on the html video element
    // can be accessed using the element itself using the element getter.

    load() {
        this._video.load()
    }

    pause() {
        this._video.pause()
    }

    // returns a promise
    play() {
        return this._video.play()
    }

    _audible() {
        return this._video.volume > 0
    }

    _mute() {
        this._video.volume = 0
    }

    _unmute() {
        this.video.volume = 1
    }

    toggleMute() {
        this._audible() ? this._mute() : this._unmute()
    }

    set currentTime(seconds) {
        this._video.currentTime = seconds
    }

    get currentTime() {
        return this._video.currentTime
    }
}
