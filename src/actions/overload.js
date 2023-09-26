import VideoElement from '../models/video/video.js'

class SpotifyVideo {
    #video
    #tries = 0
    #originalCreateElement = document.createElement

    constructor() {
        this.#overloadCreateElement()
        this.#init()
    }

    #overloadCreateElement() {
        const self = this

        document.createElement = function (tagName) {
            const element = self.#originalCreateElement.apply(this, arguments)

            if (tagName === 'video') {
                self.#video = new VideoElement(element)
                
                document.createElement = self.#originalCreateElement
            }
            return element
        }
    }

    #init = () => {
        try {
            this.#tries++
            this.#checkForMainEl()
        } catch {
            if (this.#tries <= 20) {
                setTimeout(this.#init, 500)
                return
            }
        }
    }

    #checkForMainEl() {
        const mainEl = document.getElementById('main')

        if (mainEl === null) {
            throw new Error('Main container element not found')
        }
    }

    get element() {
        return this.#video
    }
}

export const spotifyVideo = new SpotifyVideo()
