import { songState } from '../../data/song-state.js'
import { spotifyVideo } from '../../actions/overload.js'

import { highlightElement } from '../../utils/higlight.js'

export default class SongTracker {
    constructor() {
        this._startedAtZero = false
        this._video = spotifyVideo.element
        this.initState()
    }

    get #isPaused() {
        return this._video.element.paused || !this._video.element.playing
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        if (this.#isPaused) playButton?.click()
    }

    async #getSongState() {
        return await songState()
    }

    async initState() {
        const { isSkipped, playbackRate, preservesPitch } = await this.#getSongState()
        this._video.playbackRate = playbackRate
        this._video.preservesPitch = preservesPitch
        !isSkipped && this.#playTrack()
    }

    initInterval() {
        return setInterval(async () => {
            if (this.#isEditing) return
            const songStateData = await this.#getSongState()

            highlightElement({ selector: '#chorus-icon > svg', songStateData })

            if (!songStateData.isSkipped) {
                this.#handleSongStart(songStateData)
                this.#handleSongEnd(songStateData)
                if (this.#isMuted) this.#toggleMuteIfMuted()
            } else {
                if (!this.#isMuted) this.#toggleMuteIfMuted()
            }
        }, 1000)
    }

    #handleSkippedSong({ isSkipped }) {
        if (isSkipped) {
            this.#muteAndSkip()
        }
    }

    #setVideoTime(timeObject) {
        this._video.element.currentTime = timeObject
    }

    #atSongStart(startTime) {
        return parseInt(startTime, 10) > parseInt(this._video.currentTime, 10)
    }

    #handleSongStart({ startTime }) {
        if (this.#atSongStart(startTime)) {
            this.#setVideoTime({ source: 'chorus', value: startTime }) 
        }
    }

    #atSongEnd(endTime) {
        return parseInt(this._video.currentTime, 10) >= parseInt(endTime, 10)
    }

    #handleSongEnd({ isSnip, endTime, startTime }) {
        if (this.#atSongEnd(endTime)) {
            if (isSnip && this.#isLooping) {
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

    #muteAndSkip() {
        if (!this.#isMuted) {
            this.#muteButton.click()
        }
        this.#nextButton.click()
    }

    //  ============= TODO: move below into utils? =========
  
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

    // =============== TODO ================================
}
