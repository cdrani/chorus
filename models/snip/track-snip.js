import Snip from './snip.js'

import { trackSongInfo } from '../../utils/song.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

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
        const { url } = trackSongInfo(this.#row)
        const { startTime, endTime } = this.read()
        
        const shareURL = `${location.origin}${url}?startTime=${startTime}&endTime=${endTime}`
        copyToClipBoard(shareURL)

        const alertBox = document.getElementById('chorus-alert') 
        const alertMessage = alertBox.querySelector('[id="chorus-alert-message"]')
        alertMessage.textContent = `Snip copied to clipboard.`
        alertBox.style.display = 'flex' 
        setTimeout(() => { alertBox.style.display = 'none' }, 3000)
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

