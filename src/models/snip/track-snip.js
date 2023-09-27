import Snip from './snip.js'

import { trackSongInfo } from '../../utils/song.js'
import { highlightElement } from '../../utils/higlight.js'

export default class TrackSnip extends Snip {
    #row

    constructor(store) {
        super(store)
    }

    init(row) {
        super.init()

        this.#row = row
        this._controls.init()
        this.#displayTrackInfo()
        const { id, endTime: duration } = trackSongInfo(row)
        this._controls.setInitialValues({ ...this.read(), id, duration })
    }

    #displayTrackInfo() {
        const { id } = trackSongInfo(this.#row) 
        const [title, artists] = id.split(' by ')
        super._setTrackInfo({ title, artists })
    }

    get _defaultTrack() {
        const { id, endTime } = trackSongInfo(this.#row)

        return {
            id,
            value: {
                endTime,
                startTime: 0,
                isSnip: false,
                isSkipped: false,
            },
        }
    }

    updateView() {
        super._updateView()
        this.highlightSnip()
    }

    toggleIconVisibility({ isSnip }) {
        const icon = this.#row.queryselector('button[role="snip"]')
        icon.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    highlightSnip() {
        const songStateData = this.read()
        highlightElement({ 
            songStateData,
            property: 'color',
            context: this.#row,
            selector: 'svg[role="snip"]',
        })

        this.toggleIconVisibility(songStateData)
    }

    get trackURL() {
        const { url } = trackSongInfo(this.#row)
        return url
    }

    share() {
        super._share()
    }

    async save() {
        const { inputLeft, inputRight } = this._elements
        const { isSkipped } = this.read()

        await this._store.saveTrack({
            id: trackSongInfo(this.#row).id,
            value: {
                isSnip: true,
                startTime: inputLeft.value,
                endTime: inputRight.value,
                isSkipped: inputRight.value == 0 || isSkipped,
            },
        })

        this.updateView()
    }
}

