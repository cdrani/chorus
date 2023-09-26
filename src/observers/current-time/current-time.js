import SongTracker from './song-tracker.js'
import SeekIcons from '../../models/seek/seek-icon.js'

import { songState } from '../../data/song-state.js'
import { timeToSeconds } from '../../utils/time.js'

export default class CurrentTimeObserver {
    constructor(video) {
        this._video = video
        this._observer = null
        this._seekIcons = new SeekIcons()
        this._songTracker = new SongTracker()

        this.#init()
        this.observe()
    }

    async #init() {
        const { isSnip, isShared } = await songState()
        if (isShared) {
            await this._songTracker.initSharedState()
            return
        }

        if (!isSnip) return

        const currentTime = timeToSeconds(this.#playbackPosition?.textContent || '0:00')
        if (currentTime > 0) {
            this._video.currentTime = currentTime
        }
    }

    get #playbackPosition() {
        return document.querySelector('[data-testid="playback-position"]')
    }

    observe() {
        this._seekIcons.init()
        this._observer = this._songTracker.init()
    }

    disconnect() {
        if (!this._observer) return

        clearInterval(this._observer)
        this._seekIcons.removeIcons()
        this._observer = null
    }
}
