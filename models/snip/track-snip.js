import Snip from './snip.js'

import { trackSongInfo } from '../../utils/song.js'

export default class TrackSnip extends Snip {
    #row

    constructor(store) {
        super(store)
    }

    init(row) {
        super.init()

        this.#row = row
        this._controls.init()
        const { id, endTime: duration } = trackSongInfo(row)
        this._controls.setInitialValues({ ...this.read(), id, duration })
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
    }

    _highlightSnip(isSnip) {
        const svgElement = this.#row.querySelector('svg[role="snip"]')
        const fill = isSnip ? '#1ed760' : 'currentColor'

        if (!svgElement) return

        svgElement.style.color = fill

        const icon = this.#row.querySelector('button[role="snip"]')
        icon.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    share() {
        const songInfo = trackSongInfo(this.#row)
        console.log({ songInfo })
    }

    async save() {
        const { inputLeft, inputRight } = this._controls.slider.elements
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

