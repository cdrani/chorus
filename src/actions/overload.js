import Reverb from '../models/reverb/reverb.js'
import VideoElement from '../models/video/video.js'

class SpotifyVideo {
    constructor() {
        this._video
        this._reverb
        this._originalCreateElement = document.createElement
        this.#init()
    }

    #init() {
        const self = this

        document.createElement = function (tagName) {
            const element = self._originalCreateElement.apply(this, arguments)

            if (tagName === 'video') {
                self._reverb = new Reverb(element)
                self._video = new VideoElement({ video: element, reverb: self._reverb })
                document.createElement = self._originalCreateElement
            }
            return element
        }
    }

    get element() {
        return this._video
    }

    get reverb() {
        return this._reverb
    }
}

export const spotifyVideo = new SpotifyVideo()
