class App {
    #video
    #store
    #skip
    #snip
    #main
    #listener
    #intervalId
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
        this.#skip = new Skip(this.#store)
        this.#snip = new Snip({ video: this.#video, store: this.#store })

        this.#listener = new ButtonListeners(this.#snip)

        this.#main = new Main({
            snip: this.#snip,
            listener: this.#listener,
        })

        this.#nowPlayingObserver = new NowPlayingObserver(this.#snip)
        this.#trackListObserver = new TrackListObserver(this.#skip)
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
