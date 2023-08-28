import { spotifyVideo } from './overload.js'

import Main from './main.js'
import { store } from '../stores/data.js'
import TrackList from '../models/tracklist/track-list.js'
import CurrentSnip from '../models/snip/current-snip.js'

import TrackListObserver from '../observers/track-list.js'
import NowPlayingObserver from '../observers/now-playing.js'
import CurrentTimeObserver from '../observers/current-time.js'

class App {
    #video
    #store
    #snip
    #main
    #intervalId
    #trackList
    #active = true
    #currentTimeObserver
    #nowPlayingObserver
    #trackListObserver

    constructor({ video, store }) {
        this.#store = store
        this.#video = video

        this.#init()
    }

    #init() {
        this.#trackList = new TrackList(this.#store)
        this.#snip = new CurrentSnip(this.#store)

        this.#main = new Main(this.#snip)

        this.#nowPlayingObserver = new NowPlayingObserver({ snip: this.#snip, video: this.#video })
        this.#trackListObserver = new TrackListObserver(this.#trackList)
        this.#currentTimeObserver = new CurrentTimeObserver({ video: this.#video, snip: this.#snip })

        this.#snip.updateView()

        this.#resetInterval()    

        this.#reInit()
    }

    #resetInterval() {
        if (!this.#intervalId) return 

        clearInterval(this.#intervalId)
        this.#intervalId = null
    }

    disconnect() {
        this.#active = false
        this.#video.reset()

        this.#trackListObserver.disconnect()
        this.#currentTimeObserver.disconnect()
        this.#nowPlayingObserver.disconnect()
        
        this.#resetInterval()
    }

    async connect() {
        this.#active = true

        this.#trackListObserver.observe()
        this.#currentTimeObserver.observe()
        this.#nowPlayingObserver.observe()

        this.#resetInterval()
        await this.#video.activate()

        this.#reInit()
    }

    #reInit() {
        this.#intervalId = setInterval(async () => {
            if (!this.#active) return
            if (!this.#intervalId) return

            const chorus = document.querySelectorAll('#chorus')

            if (chorus?.length == 0) {
                this.#main.init()
                await this.#video.activate()
            }
        }, 3000)
    }
}

const setup = setInterval(async () => {
    const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"]')
    if (!nowPlayingWidget) return

    await load()
    clearInterval(setup)
}, 500)

async function load() {
    const video = spotifyVideo.element

    await store.populate()

    const app = new App({ video, store })

    document.addEventListener('app.enabled', async e => {
        const { enabled } = e.detail
        enabled ? await app.connect() : app.disconnect()
    })
}
