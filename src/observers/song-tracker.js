import { currentData } from '../data/current.js'
import { songState } from '../data/song-state.js'
import { spotifyVideo } from '../actions/overload.js'

import { playback } from '../utils/playback.js'
import { timeToSeconds } from '../utils/time.js'
import { currentSongInfo } from '../utils/song.js'
import { highlightElement } from '../utils/higlight.js'

import { queue } from '../models/queue.js'
import Dispatcher from '../events/dispatcher.js'

export default class SongTracker {
    constructor() {
        this._init = true
        this._reverbSet = false
        this._currentSongState = null
        this._video = spotifyVideo.element
        this._dispatcher = new Dispatcher()
        this._queue = queue
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

    get #isFirefox() { return navigator.userAgent.includes('Firefox') }

    async #setReverb () {
        if (this._reverbSet) return

        const effect = sessionStorage.getItem('reverb') ?? 'none'
        await spotifyVideo.reverb.setReverbEffect(effect)
        this._reverbSet = true
    }

    #updateQueue = async () => { await this._queue.updateQueueList() }

    get #playButton() {
        return document.querySelector('[data-testid="control-button-playpause"]')
    }

    #setupListeners() { 
        this._video.element.addEventListener('timeupdate', this.#handleTimeUpdate)
        // this._video.element.addEventListener('playing', this.#updateQueue)
        this._video.element.addEventListener('play', this.#updateQueue)
        // this._video.element.addEventListener('durationchange', this.#updateQueue)
    }

    clearListeners() {
        this._video.element.removeEventListener('timeupdate', this.#handleTimeUpdate)
        this._video.element.removeEventListener('play', this.#updateQueue)
        // this._video.element.removeEventListener('pause', this.#updateQueue)
        // this._video.element.addEventListener('durationchange', this.#updateQueue)
        this._reverbSet = false
    }

    async #applyEffects({ isShared, isSnip, playbackRate, preservesPitch }) {
        const { preferredRate, preferredPitch, track } = await currentData.getPlaybackValues()
        this._video.currentSpeed = isShared ? playbackRate : preferredRate
        this._video.playbackRate = this._video.currentSpeed
        this._video.preservesPitch = isShared ? preservesPitch : preferredPitch

        highlightElement({ selector: '#chorus-icon > svg', songStateData: { isSnip, isShared, ...track } })
    }

    async #setCurrentSongData() {
        const songStateData = await songState()
        const songInfo = { ...songStateData, ...currentSongInfo() }
        this._currentSongState = songInfo
        return songInfo
    }

    async #dispatchPlayFromQueue({ uris, uri, position }) {
        console.log('dispatchPlayFromQueue ...')
        return await this._dispatcher.sendEvent({
            eventType: 'play.queue-position',
            detail: { key: 'play.queue-position', values: { uris, uri, position } },
        })
    }

    async #handleEmptyQueue({ startTime, trackId, isSkipped }) {
        if (isSkipped) return this.#nextButton.click()

        const parsedStartTime = parseInt(startTime, 10) * 1000
        const currentPosition = timeToSeconds(this.#playbackPosition?.textContent || '0:00')
        const currentPositionTime = parseInt(currentPosition, 10) * 1000

        if (parsedStartTime != 0 && currentPositionTime < parsedStartTime) {
            const uri = `spotify:track:${trackId}`
            this.#mute()
            await this.#dispatchPlayFromQueue({ position: parsedStartTime / 1000, uri })
            this.#mute()
        }
    }

    async #playNextUnSkippedTrack({ startTime, trackId, isSnip, isSkipped }) {
        if (!isSkipped || !isSkipped) return
    
        const list = this._queue.queueList

        if (!list.length) { 
            await this.#handleEmptyQueue({ trackId, startTime, isSnip, isSkipped })
            await this._queue.updateQueueList()
            const list = this._queue.queueList

            const uri = `spotify:track:${trackId}`
            // await this.#dispatchPlayFromQueue({ position: startTime, uri })

            // const unSkippedTrack = list.find(({ isSkipped }) => !isSkipped)
            const uris = list.filter(({ isSkipped }) => !isSkipped).map(({ uri }) => uri)
            console.log({ list, uris })
            uris.length && await this.#dispatchPlayFromQueue({ position: startTime, uris })
            this.#mute()
            return
        }


        const unSkippedTrack = list.find(({ isSkipped }) => !isSkipped)
        const uris = list.filter(({ isSkipped }) => !isSkipped).map(({ uri }) => uri)

        const { startTime: position = startTime, uri = `spotify:track:${trackId}` } = unSkippedTrack

        await this.#dispatchPlayFromQueue({ position, uris })
        await this._queue.updateQueueList()

        // this.#unMute()
    }

    async songChange(initialData = null) {
        if (!this._init) this.#mute()

        const songStateData = initialData ?? await this.#setCurrentSongData()
        await this.#applyEffects(songStateData)
        const { isSnip, isSkipped, track_id, trackId, startTime } = songStateData

        if (this._init || isSnip || isSkipped) { 
            await this.#playNextUnSkippedTrack({ startTime, trackId: track_id ?? trackId, isSkipped, isSnip })
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
