import Snip from './snip.js'

import { playback } from '../../utils/playback.js'
import { currentSongId } from '../../utils/song.js'

export default class CurrentSnip extends Snip {
    constructor(store) {
        super(store)
    }

    init() {
        super.init()

        this._controls.init()
        this._controls.setInitialValues(this.read())
    }

    get _defaultTrack() {
        return {
            id: currentSongId(),
            value: {
                startTime: 0,
                isSnip: false,
                isSkipped: false,
                endTime: playback.duration(),
            },
        }
    }

    updateView() {
        super._updateView()
    }

    _highlightSnip(isSnip) {
        const svgElement = document.getElementById('chorus-highlight')
        const fill = Boolean(isSnip) ? '#1ed760' : 'currentColor'

        if (!svgElement) return

        svgElement.style.stroke = fill
    }

    share() {
        // TODO: implement
    }

    async save() {
        const { inputLeft, inputRight } = this._controls.slider.elements
        const { isSkipped } = this.read()

        await this._store.saveTrack({
            id: currentSongId(),
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
