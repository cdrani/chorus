import { store } from '../stores/data.js'
import CurrentSnip from './snip/current-snip.js'
import TrackList from './tracklist/track-list.js'
import NowPlayingIcons from './now-playing-icons.js'

import Chorus from './chorus.js'
import SongTracker from '../observers/song-tracker.js'
import TrackListObserver from '../observers/track-list.js'
import NowPlayingObserver from '../observers/now-playing.js'

export default class App {
    constructor(video) {
        this._store = store
        this._video = video

        this._active = true
        this._intervalId = null

        this.#init()
    }

    #init() {
        this._songTracker = new SongTracker()
        this._chorus = new Chorus(this._songTracker)
        this._snip = new CurrentSnip(this._songTracker)

        this._nowPlayingIcons = new NowPlayingIcons({ snip: this._snip, chorus: this._chorus })
        this._nowPlayingObserver = new NowPlayingObserver({
            snip: this._snip,
            chorus: this._chorus,
            songTracker: this._songTracker
        })
        this._trackListObserver = new TrackListObserver(new TrackList(this._songTracker))

        this.#resetInterval()    
        this.#reInit()
    }

    #resetInterval() {
        if (!this._intervalId) return 

        clearInterval(this._intervalId)
        this._intervalId = null
    }

    disconnect() {
        this._active = false
        this._video.reset()

        this._trackListObserver.disconnect()
        this._nowPlayingObserver.disconnect()
        
        this.#resetInterval()
    }

    async connect() {
        this._active = true

        this._trackListObserver.observe()
        this._nowPlayingObserver.observe()

        this.#resetInterval()
        this.#reInit()
    }

    #reInit() {
        this._intervalId = setInterval(async () => {
            if (!this._active) return
            if (!this._intervalId) return

            const chorus = document.getElementById('chorus')

            if (!chorus) {
                this._nowPlayingIcons.init()
            }
        }, 3000)
    }
}
