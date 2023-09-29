import { store } from '../stores/data.js'
import { spotifyVideo } from './overload.js'
import CurrentSnip from '../models/snip/current-snip.js'
import TrackList from '../models/tracklist/track-list.js'
import NowPlayingIcons from '../models/now-playing-icons.js'

import TrackListObserver from '../observers/track-list.js'
import NowPlayingObserver from '../observers/now-playing.js'
import CurrentTimeObserver from '../observers/current-time/current-time.js'

class App {
    constructor({ video, store }) {
        this._store = store
        this._video = video
        this._active = true
        this._intervalId = null

        this.#init()
    }

    #init() {
        this._snip = new CurrentSnip()

        this._nowPlayingIcons = new NowPlayingIcons(this._snip)
        this._currentTimeObserver = new CurrentTimeObserver(this._video)
        this._trackListObserver = new TrackListObserver(new TrackList(this._store))
        this._nowPlayingObserver = new NowPlayingObserver({ snip: this._snip, video: this._video })

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
        this._currentTimeObserver.disconnect()
        this._nowPlayingObserver.disconnect()
        
        this.#resetInterval()
    }

    async connect() {
        this._active = true

        this._trackListObserver.observe()
        this._currentTimeObserver.observe()
        this._nowPlayingObserver.observe()

        this.#resetInterval()
        await this._video.activate()

        this.#reInit()
    }

    #reInit() {
        this._intervalId = setInterval(async () => {
            if (!this._active) return
            if (!this._intervalId) return

            const chorus = document.getElementById('chorus')

            if (!chorus) {
                this._nowPlayingIcons.init()
                await this._video.activate()
            }
        }, 3000)
    }
}

let loaded = false
const video = spotifyVideo.element

const setup = setInterval(async () => {
    const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"]')
    if (!video && !nowPlayingWidget) return

    if (!loaded) {
        await load()
        loaded = true
    }
    clearInterval(setup)
}, 500)

async function load() {
    const video = spotifyVideo.element

    await store.populate()

    const app = new App({ video, store })
    const enabled = sessionStorage.getItem('enabled') == 'true'
    video.active = enabled

    document.addEventListener('app.enabled', async e => {
        const { enabled } = e.detail
        
        sessionStorage.setItem('enabled', enabled)
        video.active = enabled

        enabled ? await app.connect() : app.disconnect()
    })
}
