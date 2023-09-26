import { secondsToTime } from '../../utils/time.js'
import { songState } from '../../data/song-state.js'
import { spotifyVideo } from '../../actions/overload'

export default class SongTracker {
    constructor() {
        this._synced = false
        this._startedAtZero = false
        this._video = spotifyVideo.element
    }

    init() {
        return setInterval(async () => {
            if (this.#isEditing) return

            const songStateData = await this.#getSongState()
            this.#handleSharedSong(songStateData)
            this.#handleUntouchedSong(songStateData)
            this.#handleSkippedSong(songStateData)
            this.#handleSnipStart(songStateData)
            this.#handleSnipEnd(songStateData)
            this.#toggleMuteIfMuted()
        }, 1000)
    }

    get #isPaused() {
        return this._video.element.paused || !this._video.element.playing
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        const controlPlay = document.querySelector('[data-testid="control-button-playpause"]')
        if (this.#isPaused) playButton?.click() ?? controlPlay?.click()
    }

    async initSharedState() {
        const { playbackRate, preservesPitch, startTime } = await this.#getSongState()
        this._video.playbackRate = playbackRate
        this._video.preservesPitch = preservesPitch
        this.#setVideoTime({ source: 'chorus', value: startTime })
        this._video.element.currentTime = startTime
        this.#playbackPosition.textContent = secondsToTime(startTime)
        this.#playTrack()
    }

    async #getSongState() {
        return await songState()
    }

    #handleSharedSong({ isShared, startTime }) {
        if (isShared && !this._synced) {
            this.#setVideoTime({ source: 'chorus', value: startTime })
            this._synced = true
        }
    }

    #handleUntouchedSong({ isSkipped, isShared, isSnip, startTime }) {
        if (!isSkipped && !isShared && !isSnip && !this._startedAtZero) {
            this.#setVideoTime({ source: 'chorus', value: startTime })
            this._startedAtZero = true
        }
    }

    #handleSkippedSong({ isSkipped }) {
        if (isSkipped) {
            this.#muteAndSkip()
        }
    }

    #handleSnipStart({ isSnip, startTime }) {
        if (this.#atPreSnipStart({ isSnip, startTime })) {
            this.#setVideoTime({ source: 'chorus', value: startTime }) 
        }
    }

    #handleSnipEnd({ isSnip, endTime, startTime }) {
        if (this.#atSnipEnd({ isSnip, endTime })) {
            if (this.#isLooping) {
                this.#setVideoTime({ source: 'chorus', value: startTime }) 
            } else {
                this.#muteAndSkip()
            }
        }
    }

    #toggleMuteIfMuted() {
        if (this.#isMuted) {
            this.#muteButton.click()
        }
    }

    #setVideoTime(timeObject) {
        this._video.currentTime = timeObject
        this.#playbackPosition.textContent = secondsToTime(timeObject.value)
    }

    #muteAndSkip() {
        if (!this.#isMuted) {
            this.#muteButton.click()
        }
        this.#nextButton.click()
    }

    #atPreSnipStart({ isSnip, startTime }) {
        return isSnip && parseInt(startTime, 10) > parseInt(this._video.currentTime, 10)
    }

    #atSnipEnd({ isSnip, endTime }) {
        return isSnip && parseInt(this._video.currentTime, 10) >= parseInt(endTime, 10)
    }

    // TODO: move below into utils?
    get #isEditing() {
        const mainElement = document.getElementById('chorus-main')
        if (!mainElement) return

        return main.style.display == 'block'
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }

    get #muteButton() {
        return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]')
    }

    get #isMuted() {
        return this.#muteButton?.getAttribute('aria-label') == 'Unmute'
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }
}
