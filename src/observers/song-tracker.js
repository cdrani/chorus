import { request } from '../utils/request.js'
import { playback } from '../utils/playback.js'
import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { highlightElement } from '../utils/higlight.js'

export default class SongTracker {
    constructor() {
        this._synced = false
        this._timeout = null
        this._currentTrackId = null
        this._currentSongState = null
        this._video = spotifyVideo.element
    }

    async init() {
        await this.#setSharedState()
        await this.songChange()
        this.#setupListeners()
    }

    get #isPaused() {
        return this._video.element.paused
    }

    #playTrack() {
        const playButton = document.querySelector('[data-testid="play-button"]')
        if (this.#isPaused) playButton?.click()
    }

    set currentSongState(values) {
        this._currentSongState = {
            ...this._currentSongState,
            ...values,
        }
    }

    async #setSharedState() {
        const { isShared, playbackRate = 1, preservesPitch = true } = await songState()
        if (!isShared) return

        this._video.playbackRate = playbackRate
        this._video.preservesPitch = preservesPitch
        await this.#handleShared()
    }

    get #isLooping() {
        const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
        return repeatButton?.getAttribute('aria-label') === 'Disable repeat'
    }

    async #seekTo(position) {
        await request({ 
            type: 'seek',
            value: parseInt(position, 10) * 1000,
            cb: () => { 
                this.#unMute() 
            },
        })
    }

    async #goToNext() {
        this.#mute()
        await request({ type: 'next', cb: () => { this.#unMute() } })
    }

    async #handleShared() {
        this.#mute()
        const { isShared, startTime } = await songState()
        if (!isShared) return
        this._video.currentTime = { source: 'chorus', value: startTime }
        this.#playTrack()

        setTimeout(async () => await this.#seekTo(startTime), 1000)
    }

    #mute() { this._video.volume = 0 }
    #unMute = () => { this._video.volume = 1 }

    #setupListeners() {
        this._video.element.addEventListener('playing', this.#unMute)
        this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate)
    }

    clearListeners() {
        this._video.element.removeEventListener('playing', this.#unMute)
        this._video.element.removeEventListener('timeupdate', this.#handleTimeUpdate)
    }

    #clearHistory(isShared) {
        if (!isShared && location?.search) {
            history.pushState(null, '', location.pathname)
        }
    }

    async #applyEffects({ isShared, playbackRate, preservesPitch }) {
        const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
        this._video.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this._video.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch
    }

    async #setCurrentSongData() {
        const songStateData = await songState()
        this._currentSongState = songStateData
        return songStateData
    }

    async songChange() {
        const PREV_TRACKID = this._currentTrackId
        this._synced = false

        const songStateData = await this.#setCurrentSongData()
        const { isSnip, trackId, isSkipped, startTime, isShared } = songStateData
        this.#clearHistory()

        await this.#applyEffects(songStateData)

        if (PREV_TRACKID == this._currentSongState?.trackId) {
            this.#unMute()
            if (isSkipped) this.#nextButton.click()
            if (isSnip) this._video.currentTime = { source: 'chorus', value: startTime }
            return
        }

        if (!this._currentTrackId) {
            if (isSnip) this._video.currentTime = { source: 'chorus', value: startTime } 
        }
        
        if (isSkipped) {
            return (await this.#goToNext())
        } else if (isSnip || isShared) {
            this.#mute()
            await this.#seekTo(startTime)
            this.#unMute()
        } else {
            this.#unMute()
            this._video.play()
        }

        highlightElement({ selector: '#chorus-icon > svg', songStateData })
        this._currentTrackId = trackId
    }

    #handleTimeUpdate = () => {
        if (this._video.isEditing) return
        if (!this._currentSongState) return

        const currentTime = this._video.currentTime
        const { startTime } = this._currentSongState

        if (!this._synced && parseInt(currentTime, 10) < parseInt(startTime)) {
            this.#mute()
        } else {
            this.#unMute()
            this._synced = true
        }

        setTimeout(() => {
            
            const endTime = this?._currentSongState?.endTime || playback.duration()
            if (endTime == playback.duration) return

            const atSongEnd = parseFloat(this._video.currentTime, 10) >= parseInt(endTime, 10)
            if (!atSongEnd) return

            if (this.#isLooping) {
                this._video.currentTime = { source: 'chorus', value: startTime }
                return
            }
            this.#nextButton.click()
            this.#mute()
        }, 1000)
    }

    get #nextButton() {
        return document.querySelector('[data-testid="control-button-skip-forward"]')
    }
}
