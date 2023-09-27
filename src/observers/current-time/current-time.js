import SongTracker from './song-tracker.js'
import SeekIcons from '../../models/seek/seek-icon.js'

export default class CurrentTimeObserver {
    constructor(video) {
        this._video = video
        this._observer = null
        this._seekIcons = new SeekIcons()
        this._songTracker = new SongTracker()

        this.observe()
    }

    observe() {
        this._seekIcons.init()
        this._observer = this._songTracker.initInterval()
    }

    disconnect() {
        if (!this._observer) return

        clearInterval(this._observer)
        this._seekIcons.removeIcons()
        this._observer = null
    }
}
