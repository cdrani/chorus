class SpotifyVideo {
    constructor() {
        this._video = null
        this._tries = 0
        this.originalCreateElement = document.createElement

        this._overloadCreateElement()
        this._init()
    }

    _overloadCreateElement() {
        const self = this

        document.createElement = function (tagName) {
            const element = self.originalCreateElement.apply(this, arguments)

            if (tagName === 'video') {
                self._video = element
                document.createElement = self.originalCreateElement
            }
            return element
        }
    }

    _init() {
        try {
            this._tries++
            this._checkForMainEl()
        } catch {
            if (this._tries <= 20) {
                setTimeout(this._init, 500)
                return
            }
        }
    }

    _checkForMainEl() {
        const mainEl = document.getElementById('main')

        if (mainEl === null) {
            throw new Error('Main container element not found')
        }
    }

    get element() {
        return this._video
    }
}

const spotifyVideo = new SpotifyVideo()
