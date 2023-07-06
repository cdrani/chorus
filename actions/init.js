class App {
    constructor({ video, store }) {
        this._video = video
        this._store = store
        // TODO: break this class down? This class may be handling a lot?

        this._icon = new Icon()
        this._snip = new Snip({ video: this._video, store: this._store })

        new SkipBackListener(this._snip).listen()
        this._listener = new ButtonListeners(this._snip)

        this._main = new Main({
            snip: this._snip,
            listener: this._listener,
        })

        this._currentObserver = new CurrentTimeObserver({ video: this._video, snip: this._snip })
        this._nowPlayingObserver = new NowPlayingObserver(this._snip)

        this._intervalId = null

        this._init()
    }

    _init() {
        this._icon.setupToggler(this._main.toggler.bind(this._main))
        this._snip.load()

        this._reInit()
    }

    disconnect() {
        this._currentObserver.disconnect()
        this._nowPlayingObserver.disconnect()

        clearInterval(this._intervalId)
    }

    connect() {
        this._currentObserver.observe()
        this._nowPlayingObserver.observe()
    }

    // TODO: re-initializes when Spotify Connect switches device from
    // current browser tab to another tab, window, or device.
    // Looking for a better solution.
    _reInit() {
        this._intervalId = setInterval(() => {
            const mainElement = this._main.element
            if (!mainElement?.children?.length) {
                this._main.init()
                this._init()
            }
        }, 5000)
    }
}

setTimeout(async () => {
    const store = new DataStore()
    const video = new VideoElement(spotifyVideo.element)

    await store.populate()

    const app = new App({ video, store })

    document.addEventListener('app.enabled', e => {
        const { enabled } = e.detail
        enabled ? app.connect() : app.disconnect()
    })
}, 2500)
