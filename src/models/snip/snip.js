import { store } from '../../stores/data.js'

import Alert from '../alert.js'
import SliderControls from '../slider/slider-controls.js'

import { copyToClipBoard } from '../../utils/clipboard.js'
import { timeToSeconds } from '../../utils/time.js'

export default class Snip {
    constructor() {
        this._store = store
        this._alert = new Alert()
        this._controls = new SliderControls()
    }

    init() {
        this._controls.init()
    }

    read() {
        return this._store.getTrack(this._defaultTrack)
    }

    reset() {
        this._controls.setInitialValues()
    }

    async delete() {
        await this._store.deleteTrack(this._defaultTrack)
        this._updateView()
    }

    _updateView() {
        const response = this.read()
        const { isSnip, isSkip } = response

        this.#setUpdateControls(response)
        this.#toggleRemoveButton(isSnip || isSkip)
    }

    get tempShareTimes() {
        const tempEndTime = document.getElementById('chorus-end')?.textContent
        const tempStartTime = document.getElementById('chorus-start')?.textContent

        return {
            tempEndTime: timeToSeconds(tempEndTime),
            tempStartTime: timeToSeconds(tempStartTime),
        }
    }

    _share() {
        const { startTime, endTime, playbackRate = '1.00', preservesPitch = true } = this.read()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 100

        const { tempEndTime = startTime, tempStartTime = endTime } = this.tempShareTimes
        
        const shareURL = `${this.trackURL}?ch=${tempStartTime}-${tempEndTime}-${rate}-${pitch}`
        copyToClipBoard(shareURL)

        this.displayAlert()
    }

    #toggleRemoveButton(showRemove) {
        const removeButton = document.getElementById('chorus-snip-remove-button')

        if (!removeButton) return
        removeButton.style.display = showRemove ? 'block' : 'none'
    }

    #setUpdateControls(response) {
        this._controls.updateControls(response)
    }

    get _elements() {
        return {
            inputRight: document.getElementById('input-end'),
            inputLeft: document.getElementById('input-start'),
        }
    }

    displayAlert() {
        this._alert.displayAlert()
    }

    _setTrackInfo({ title, artists }) {
        const titleElement = document.getElementById('track-title')
        const artistsElement = document.getElementById('track-artists')

        titleElement.textContent = title
        artistsElement.textContent = artists
    }
}
