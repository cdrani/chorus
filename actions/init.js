class App {
    #video
    #icon
    #skip
    #snip
    #main
    #listener
    #intervalId
    #currentObserver
    #nowPlayingObserver
    #trackListObserver

    constructor({ video, store }) {
        this.#video = new VideoElement(video)
        // TODO: break this class down? This class may be handling a lot?

        this.#icon = new Icon()
        this.#skip = new Skip(store)
        this.#snip = new Snip({ video: this.#video, store })

        this.#listener = new ButtonListeners(this.#snip)

        this.#main = new Main({
            snip: this.#snip,
            listener: this.#listener,
        })

        this.#nowPlayingObserver = new NowPlayingObserver(this.#snip)
        this.#trackListObserver = new TrackListObserver(this.#skip)
        this.#currentObserver = new CurrentTimeObserver({ video: this.#video, snip: this.#snip })

        this.#intervalId = null

        this.#init()
    }

    #init() {
        this.#icon.setupToggler(this.#main.toggler.bind(this.#main))
        this.#snip.updateView()

        this.#reInit()
    }

    disconnect() {
        this.#trackListObserver.disconnect()
        this.#currentObserver.disconnect()
        this.#nowPlayingObserver.disconnect()

        clearInterval(this.#intervalId)
    }

    connect() {
        this.#trackListObserver.observe()
        this.#currentObserver.observe()
        this.#nowPlayingObserver.observe()
    }

    // TODO: re-initializes when Spotify Connect switches device from
    // current browser tab to another tab, window, or device.
    // Looking for a better solution.
    #reInit() {
        this.#intervalId = setInterval(() => {
            const mainElement = this.#main.element
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
