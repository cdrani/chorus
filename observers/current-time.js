class CurrentTimeObserver {
    #snip
    #video
    #observer

    constructor({ video, snip }) {
        this.#snip = snip
        this.#video = video

        this.#init()
        this.observe()
    }

    #init() {
        const { isSnip } = this.#songState
        if (!isSnip) return

        const currentTime = timeToSeconds(this.#playbackPosition?.textContent || '0:00')

        if (currentTime > 0) {
            this.#video.currentTime = currentTime
        }
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }

    get #muteButton() {
        return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]')
    }

    get #muted() {
        return this.#muteButton.ariaLabel == 'Unmute'
    }

    get #songState() {
        return this.#snip.read()
    }

    get #isSkippable() {
        const { isSkipped, endTime } = this.#songState
        return isSkipped || endTime == 0
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]') 
        return repeatButton?.ariaLabel === 'Disable repeat'
    }
 
    get #atEnd() {
        const { isSnip, endTime } = this.#songState
        return Boolean(isSnip) && endTime == parseInt(this.#video.currentTime)
    }

    get #atSnip()  {
        const { isSnip, startTime } = this.#songState
        if (!isSnip) return false

        return isSnip && parseInt(startTime) >= this.#video.currentTime 
    }

    #handleSkippable() {
        this.#video.pause()
        this.#video.currentTime = 0
        this.#nextButton.click()
        this.#video.volume = 0
    }

    observe() {
        this.#observer = setInterval(() => {
            const { isSkipped, startTime, endTime } = this.#songState
            const currentDisplayTime = secondsToTime(parseInt(this.#video.currentTime, 10))

            this.#playbackPosition.textContent = currentDisplayTime

            if (this.#video.paused) return
            
            if (isSkipped && !this.#muted) {
                this.#muteButton.click()
            }

            if (this.#isSkippable) {
                this.#handleSkippable()
            } else {
                if (this.#muted) {
                    this.#muteButton.click()
                }

                if (this.#atSnip) {
                    this.#video.currentTime = startTime
                } else if (this.#atEnd && this.#isLooping) {
                    this.#video.currentTime = startTime + 0.1
                } else if (this.#video.currentTime >= endTime) {
                    this.#nextButton.click()
                    if (!this.#muted) {
                        this.#muteButton.click()
                    }
                }
            }
        }, 500)
    }

    disconnect() {
        if (!this.#observer) return

        clearInterval(this.#observer)
        this.#observer = null
    }
}
