import { songState } from '../../data/song-state.js'
import { spotifyVideo } from '../../actions/overload.js'

import { highlightElement } from '../../utils/higlight.js'
import { secondsToTime, timeToSeconds } from '../../utils/time.js'

export default class SongTracker {
    constructor() {
        this._synced = false
        this._video = spotifyVideo.element
        this.initState()
    }

    get #isPaused() {
        return this._video.element.paused
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        if (this.#isPaused) playButton?.click()
    }

    async #getSongState() {
        return await songState()
    }

    async initState() {
        const { isShared, startTime, playbackRate, preservesPitch } = await this.#getSongState()
        this._video.playbackRate = playbackRate
        this._video.preservesPitch = preservesPitch
        isShared && this.#handleSongStart({ startTime })
    }

    initInterval() {
        return setInterval(async () => {
            const songStateData = await this.#getSongState()
            const { isShared, isSkipped } = songStateData

            highlightElement({ selector: '#chorus-icon > svg', songStateData })
            if (!isShared && location?.search) {
              history.pushState(null, '', location.pathname)
        return
            }

            if (!isSkipped) {
                if (this.#isMuted) this.#toggleMuteIfMuted()
                this.#handleSongEnd(songStateData)
            }
        }, 500)
    }

    #setVideoTime(timeObject) {
        this._video.element.currentTime = timeObject
    }

    #isSyncedFromStart() {
        const currentTime = document.querySelector('[data-testid="playback-position"]')?.textContent
        const displayedTime = timeToSeconds(currentTime)

        return parseInt(displayedTime, 10) == parseInt(this._video.currentTime, 10)
    }

    #handleSongStart({ startTime }) {
        if (!this.#isSyncedFromStart() && !this._synced && this.#isPaused) {
            this._synced = false
            setTimeout(() => {
                this.#setVideoTime({ source: 'chorus', value: startTime })
                const displayedTime = document.querySelector('[data-testid="playback-position"]')
                displayedTime.textContent = secondsToTime(startTime)
            }, 250)
            this.#playTrack()
        } else {
            this._synced = true
        }
    }

    #atSongEnd(endTime) {
        return parseInt(this._video.currentTime, 10) >= parseInt(endTime, 10) + 1
    }

    #handleSongEnd({ endTime, startTime }) {
        if (this.#atSongEnd(endTime)) {
            if (this.#isLooping) {
                this.#setVideoTime({ source: 'chorus', value: startTime }) 
            } else {
                if (!this.#isMuted) this.#muteButton.click()
                this.#nextButton.click()
            }
            return
        }
    }

    #toggleMuteIfMuted() {
        if (this.#isMuted) this.#muteButton.click()
    }

    //  ============= TODO: move below into utils? =========
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
