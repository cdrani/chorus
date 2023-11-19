import { store } from '../stores/data.js'
import { currentData } from '../data/current.js'

import LyricSnip from '../models/snip/lyric-snip.js'
import SeekIcons from '../models/seek/seek-icon.js'
import { currentSongInfo } from '../utils/song.js'

export default class NowPlayingObserver {
    constructor({ snip, chorus, songTracker }) {
        this._snip = snip
        this._observer = null
        this._currentSongId = null
        this._songTracker = songTracker

        this._chorus = chorus
        this._lyrics = new LyricSnip()
        this._seekIcons = new SeekIcons()
    }

    get #lyricsAvailable() { return !!this.#lyricsIcon }
    get #lyricsIcon() { return document.querySelector('[data-testid="lyrics-button"]') }

    async observe() {
        const target = document.querySelector('[data-testid="now-playing-widget"]')
        this._observer = new MutationObserver(this.#mutationHandler)
        this._observer.observe(target, { attributes: true })

        this._lyrics.active = this.#lyricsAvailable
        this.#toggleSnipUI()
        this._seekIcons.init()
        await this.setNowPlayingData()
        await this._songTracker.init()
    }

    #isAnchor(mutation) {
        return (
            mutation.type === 'attributes' &&
            mutation.target.localName == 'div' &&
            mutation.attributeName === 'aria-label'
        )
    }

    async setNowPlayingData() {
        const track = await currentData.readTrack()
        await store.setNowPlaying(track)
    }

    get #songId() {
        return currentSongInfo().id
    }

    get #songChanged() {
        if (this._currentSongId == null) return true

        return this.#songId !== this._currentSongId 
    }

    #mutationHandler = async mutationsList => {
        for (const mutation of mutationsList) {
            if (!this.#isAnchor(mutation)) return
            if (!this.#songChanged) return

            this._lyrics.active = this.#lyricsAvailable
            this._currentSongId = this.#songId
            if (this._chorus.isShowing) this._snip.init()

            await this.setNowPlayingData()
            await this._songTracker.songChange() 
            this._snip.updateView()
            await this._seekIcons.setSeekLabels()
        }
    }

    #toggleSnipUI() {
        const snipUI = document.getElementById('chorus')
        if (!snipUI) return

        snipUI.style.display = this._observer ? 'flex' : 'none'
        const chorusMain = document.getElementById('chorus-main')
        if (!chorusMain) return

        chorusMain.style.display = 'none'
    }

    disconnect() {
        this._observer?.disconnect()
        this._currentSongId = null
        this._seekIcons.removeIcons()
        this._songTracker.clearListeners()
        this._observer = null
        this.#toggleSnipUI()
    }
}
