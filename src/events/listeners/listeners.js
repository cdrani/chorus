import Seek from '../../models/seek/seek.js'
import Speed from '../../models/speed/speed.js'
import CurrentSnip from '../../models/snip/current-snip.js'
import { spotifyVideo } from '../../actions/overload.js'

export default class Listeners {
    constructor() {
        this._video = spotifyVideo.element
        this._seek = new Seek()
        this._speed = new Speed()
        this._snip = new CurrentSnip()
    }

    _hide() {
        const mainElement = document.getElementById('chorus-main')
        mainElement.style.display = 'none'
        this._video.isEditing = false
    }
}
