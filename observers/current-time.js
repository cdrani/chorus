import { timeToSeconds, secondsToTime } from '../utils/time.js'

export default class CurrentTimeObserver {
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

    #handleClick = e => {
        e.preventDefault()
        if (!this.#muted) this.#muteButton.click()
    }

    #setListeners() {
        this.#nextButton?.addEventListener('click', this.#handleClick)
        this.#previousButton?.addEventListener('click', this.#handleClick)
    }

    #clearListeners() {
        this.#nextButton?.removeEventListener('click', this.#handleClick)
        this.#previousButton?.removeEventListener('click', this.#handleClick)
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    get #previousButton() {
        return document.querySelector('[data-testid="control-button-skip-back"]')
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }

    get #muteButton() {
        return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]')
    }

    get #muted() {
        return this.#muteButton?.ariaLabel == 'Unmute'
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

    get #atSongStart() {
        const { startTime } = this.#songState
        return startTime == parseInt(this.#video.currentTime)
    }

    get #atSongEnd() {
        const { endTime } = this.#songState
        return endTime == parseInt(this.#video.currentTime)
    }

    get #atSnipEnd() {
        const { isSnip } = this.#songState
        return isSnip && this.#atSongEnd
    }

    get #atSnipStart() {
        const { isSnip, startTime } = this.#songState
        if (!isSnip) return false

        return isSnip && parseInt(startTime) >= this.#video.currentTime
    }

    #handleNext() {
        this.#video.currentTime = 0
        this.#nextButton.click()
        this.#video.element.load()
    }

    observe() {
        this.#setListeners()

        this.#observer = setInterval(() => {
            const { isSkipped, isSnip, startTime, endTime } = this.#songState

            if (!isSkipped && !isSnip) {
                this.#muted && this.#muteButton.click()
                return
            }

            const currentDisplayTime = secondsToTime(parseInt(this.#video.currentTime ?? 0, 10))
            this.#playbackPosition.textContent = currentDisplayTime

            if (this.#video.paused) return

            if (isSkipped && !this.#muted) {
                this.#muteButton.click()
            }

            if (this.#isSkippable) {
                this.#handleNext()
            } else if (this.#atSnipStart) {
                if (!this.#muted) this.#muteButton.click()
                this.#video.currentTime = startTime
            } else if (this.#atSnipEnd) {
                if (this.#isLooping) {
                    this.#video.currentTime = startTime + 0.1
                } else {
                    this.#handleNext()
                }
            } else if (this.#atSongEnd || this.#video.currentTime >= endTime) {
                if (!this.#muted) this.#muteButton.click()
                this.#handleNext()
            } else if (this.#muted) this.#muteButton.click()
        }, 1000)
    }

    disconnect() {
        if (!this.#observer) return

        clearInterval(this.#observer)
        this.#clearListeners()
        this.#observer = null
    }
}
