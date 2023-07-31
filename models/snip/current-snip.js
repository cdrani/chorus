import Snip from './snip.js'

import { playback } from '../../utils/playback.js'
import { currentSongInfo } from '../../utils/song.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

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
            id: currentSongInfo().id,
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
        const { url } = currentSongInfo()
        const { startTime, endTime } = this.read()
        
        const shareURL = `${url}?startTime=${startTime}&endTime=${endTime}`
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
            id: currentSongInfo().id,
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
