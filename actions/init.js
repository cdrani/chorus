import { spotifyVideo } from './overload.js'

import Main from './main.js'
import DataStore from '../stores/data.js'
import VideoElement from '../models/video.js'
import TrackList from '../models/track-list.js'
import Snip from '../models/snip/snip.js'
import ButtonListeners from '../events/listeners.js'

import TrackListObserver from '../observers/track-list.js'
import NowPlayingObserver from '../observers/now-playing.js'
import CurrentTimeObserver from '../observers/current-time.js'

class App {
    #video
    #store
    #snip
    #main
    #listener
    #intervalId
    #trackList
    #currentTimeObserver
    #nowPlayingObserver
    #trackListObserver

    constructor({ video, store }) {
        this.#store = store
        this.#video = new VideoElement(video)
        this.#intervalId = null

        this.#init()
    }

    #init() {
        this.#trackList = new TrackList(this.#store)
        this.#snip = new Snip({ video: this.#video, store: this.#store })

        this.#listener = new ButtonListeners(this.#snip)

        this.#main = new Main({
            snip: this.#snip,
            listener: this.#listener,
        })

        this.#nowPlayingObserver = new NowPlayingObserver(this.#snip)
        this.#trackListObserver = new TrackListObserver(this.#trackList)
        this.#currentTimeObserver = new CurrentTimeObserver({ video: this.#video, snip: this.#snip })

        this.#snip.updateView()

        this.#reInit()
    }

    disconnect() {
        this.#trackListObserver.disconnect()
        this.#currentTimeObserver.disconnect()
        this.#nowPlayingObserver.disconnect()

        clearInterval(this.#intervalId)
    }

    connect() {
        this.#trackListObserver.observe()
        this.#currentTimeObserver.observe()
        this.#nowPlayingObserver.observe()
    }

    // TODO: re-initializes when Spotify Connect switches device from
    // current browser tab to another tab, window, or device.
    // Looking for a better solution.
    #reInit() {
        this.#intervalId = setInterval(() => {
            const mainElement = this.#main.element
            if (this.#intervalId) return

            if (!mainElement?.children?.length) {
                this.#main.init()
                this.#init()
            }
        }, 5000)
    }
}

setTimeout(async () => {
    const store = new DataStore()
    const video = spotifyVideo.element

    await store.populate()

    const app = new App({ video, store })

    document.addEventListener('app.enabled', e => {
        const { enabled } = e.detail
        enabled ? app.connect() : app.disconnect()
    })
}, 2500)
