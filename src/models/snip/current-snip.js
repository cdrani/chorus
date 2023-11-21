import Snip from './snip.js'
import SnipSave from './snip-save.js'
import { currentData } from '../../data/current.js'
import { spotifyVideo } from '../../actions/overload.js'

import { currentSongInfo } from '../../utils/song.js'

export default class CurrentSnip extends Snip {
    constructor(songTracker) {
        super()

        this.name = 'CURRENT_SNIP'
        this._songTracker = songTracker
        this._video = spotifyVideo.element
        this._snipSave = new SnipSave(this)
    }

    async init() {
        super.init()

        this._controls.init()
        this.#displayTrackInfo()
        const track = await this.read()
        this._controls.setInitialValues(track)
    }

    #displayTrackInfo() {
        const { id } = currentSongInfo() 
        const [title, artists] = id.split(' by ')
        super._setTrackInfo({ title, artists })
    }

    get _defaultTrack() { return currentData.readTrack() }

    updateView(data = null) { super._updateView(data) }

    get trackURL() { return currentSongInfo().url }

    async updateCurrentSongData(result) { await this._songTracker.updateCurrentSongData(result) }

    async save() {
        const { inputLeft, inputRight, title, artists } = this._elements
        const id = `${title.textContent} by ${artists.textContent}`
        await this._snipSave.save({ id, startTime: inputLeft.value, endTime: inputRight.value })
    }
}
