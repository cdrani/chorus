import { currentSongInfo } from '../utils/song.js'
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
        const { isSnip, isShared, startTime } = this.#songState

        if (isShared) {
            this.#video.currentTime = startTime
            this.#playTrack()
        }

        if (!isSnip) return

        const currentTime = timeToSeconds(this.#playbackPosition?.textContent || '0:00')

        if (currentTime > 0) {
            this.#video.currentTime = currentTime
        }
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        playButton.click()
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

    get #sharedSnipValues() {
        if (!location?.search) return null
        
        const params = new URLSearchParams(location.search)
        return { 
            endTime: parseInt(params.get('endTime'), 10),
            startTime: parseInt(params.get('startTime'), 10)
        }
    }

    get #songState() {
        const state = this.#snip.read()
        const sharedSnipState = this.#sharedSnipValues
        if (!sharedSnipState) return state
        const { trackId } = currentSongInfo()

        return {
            trackId,
            isShared: true,
            ...state,
            ...sharedSnipState
        }
    }

    #clearSearchParams() {
        history.pushState(null, '', location.pathname)
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
        if (location?.search) this.#clearSearchParams()

        this.#video.currentTime = 0
        this.#nextButton.click()
        this.#video.element.load()
    }

    observe() {
        this.#setListeners()

        this.#observer = setInterval(() => {
            const { trackId, isSkipped, isShared, isSnip, startTime, endTime } = this.#songState
            
            if (!isSkipped && !isSnip) {
                this.#muted && this.#muteButton.click()
                return
            }

            if (isShared && trackId !== location.pathname.split('track/').at(1)) {
                this.#video.currentTime = startTime
                this.#playTrack()
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
