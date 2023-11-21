import Snip from './snip.js'
import SnipSave from './snip-save.js'

import { trackSongInfo } from '../../utils/song.js'
import { highlightElement } from '../../utils/higlight.js'

export default class TrackSnip extends Snip {
    constructor(store) {
        super(store)

        this._row = null
        this.name = 'TRACK_SNIP'
        this._snipSave = new SnipSave(this)
    }

    async init(row) {
        super.init()

        this._row = row
        this._controls.init()
        this.#displayTrackInfo()
        const { id, endTime: duration } = trackSongInfo(row)
        const track = await this.read()
        this._controls.setInitialValues({ ...track, id, duration })
    }

    #displayTrackInfo() {
        const { id } = trackSongInfo(this._row) 
        const [title, artists] = id.split(' by ')
        super._setTrackInfo({ title, artists })
    }

    get _defaultTrack() {
        const track = trackSongInfo(this._row)
        return { id: track.id, value: { ...track, endTime, startTime: 0, isSnip: false, isSkipped: false } }
    }

    updateView(songStateData) {
        super._updateView(songStateData)
        this.highlightSnip(songStateData)
    }

    toggleIconVisibility({ isSnip }) {
        const icon = this._row.queryselector('button[role="snip"]')
        icon.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    highlightSnip(songStateData) {
        highlightElement({ songStateData, property: 'color', context: this._row, selector: 'svg[role="snip"]' })
        this.toggleIconVisibility(songStateData)
    }

    get trackURL() { return trackSongInfo(this._row).url }

    share() { super._share() }

    async delete() { await super._delete() }

    async save() {
        const { inputLeft, inputRight } = this._elements
        const id = trackSongInfo(this._row).id
        await this._snipSave.save({ id, startTime: inputLeft.value, endTime: inputRight.value })
    }
}
