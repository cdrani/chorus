import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { playback } from '../utils/playback.js'
import { secondsToTime, timeToSeconds } from '../utils/time.js'
import { currentSongInfo } from '../utils/song.js'
import { highlightElement } from '../utils/higlight.js'

import Dispatcher from '../events/dispatcher.js'

export default class SongTracker {
    constructor() {
        this._init = true
        this._reverbSet = false
        this._currentSongState = null
        this._video = spotifyVideo.element
        this._dispatcher = new Dispatcher()
    }

    async init() {
        this.#setupListeners()
        const songStateData = await this.#setCurrentSongData()
        songStateData.isShared 
            ? await this.handleShared(songStateData)
            : await this.songChange(songStateData)
    }

    async #dispatchPlaySharedSong({ track_id, position }) {
        await this._dispatcher.sendEvent({
            eventType: 'play.shared',
            detail: { key: 'play.shared', values: { track_id, position} },
        })
    }

    async #dispatchSeekToPosition(position) {
        await this._dispatcher.sendEvent({
            eventType: 'play.seek',
            detail: { key: 'play.seek', values: { position } },
        })
    }

    async handleShared(songStateData) {
        await this.#applyEffects(songStateData)
        const { startTime: position } = songStateData
        const track_id = location.pathname?.split('/')?.at(-1)
        this._video.currentTime = position

        this.#mute()
        await this.#dispatchPlaySharedSong({ track_id, position })
        this.#unMute()
    }

    async updateCurrentSongData(values) {
        if (!values) return

        this._currentSongState = { ...this._currentSongState || {}, ...values }
        await this.#applyEffects(this._currentSongState)
    }

    get #isPlaying() {
        const playButton = document.querySelector('[data-testid="control-button-playpause"]')
        if (!playButton) return false

        return playButton.getAttribute('aria-label') == 'Pause'
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }

    get #muteButton() { return document.querySelector('[data-testid="volume-bar-toggle-mute-button"]') }

    get #isMute() { return this.#muteButton?.getAttribute('aria-label') == 'Unmute' }

    #mute() { if (!this.#isMute) this.#muteButton?.click() }
    #unMute() { if (this.#isMute) this.#muteButton?.click() }

    get #isFirefox() { return !navigator.userAgent.includes('Firefox') }

    async #setReverb () {
        if (this._reverbSet) return

        const effect = sessionStorage.getItem('reverb') ?? 'none'
        await spotifyVideo.reverb.setReverbEffect(effect)
        this._reverbSet = true
    }

    #setupListeners() { this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate) }

    clearListeners() {
        this._video.element.removeEventListener('timeupdate', this.#handleTimeUpdate)
        this._reverbSet = false
    }

    async #applyEffects({ isShared, isSnip, playbackRate, preservesPitch }) {
        const { preferredRate, preferredPitch, track } = await currentData.getPlaybackValues()
        this._video.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this._video.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch

        highlightElement({ 
            selector: '#chorus-icon > svg', 
            songStateData: { isSnip, isShared, ...track }
        })
    }

    async #setCurrentSongData() {
        const songStateData = await songState()
        const songInfo = { ...songStateData, ...currentSongInfo() }
        this._currentSongState = songInfo
        return songInfo
    }

    async songChange(initialData = null) {
        if (!this._init) this.#mute()

        const songStateData = initialData ?? await this.#setCurrentSongData()
        await this.#applyEffects(songStateData)
        const { isSnip, isSkipped, startTime } = songStateData

        if (isSkipped) {
            return this.#nextButton.click()
        } else if (isSnip) {
            const parsedStartTime = parseInt(startTime, 10) * 1000
            const currentPosition = timeToSeconds(this.#playbackPosition?.textContent || '0:00')
            const currentPositionTime = parseInt(currentPosition, 10) * 1000

            if (parsedStartTime != 0 && currentPositionTime < parsedStartTime) {
                await this.#dispatchSeekToPosition(parsedStartTime)
            } 
        }

        this.#unMute()
        this._init = false
    }

    get #nextButton() { return document.querySelector('[data-testid="control-button-skip-forward"]') }

    get #playbackPosition() { return document.querySelector('[data-testid="playback-position"]') }

    #handleTimeUpdate = async () => {
        if (this.#isPlaying && this.#isFirefox && !this._reverbSet) await this.#setReverb()

        if (this._video.isEditing) return
        if (!this._currentSongState) return

        setTimeout(async () => {
            const { isShared, startTime, endTime } = this._currentSongState
            const currentTimeMS = parseInt(this._video.currentTime * 1000, 10)

            const isSongEnd = endTime == playback.duration()
            const endTimeMS = parseInt(endTime, 10) * 1000 - (isSongEnd ? 100 : 0)
            const atSongEnd = currentTimeMS >= endTimeMS
            if (!atSongEnd) return

            if (this.#isLooping || isShared) {
                return (this._video.currentTime = startTime)
            }

            if (isShared && location?.search) history.pushState(null, '', location.pathname)
            this.#nextButton.click()
        }, 1000)
    }
}
