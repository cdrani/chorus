import { store } from '../../stores/data.js'

import Alert from '../alert.js'
import SliderControls from '../slider/slider-controls.js'

import { timeToSeconds } from '../../utils/time.js'
import { currentData } from '../../data/current.js'
import { copyToClipBoard } from '../../utils/clipboard.js'
import { setTrackInfo } from '../../utils/track-info.js'

export default class Snip {
    constructor() {
        this._store = store
        this._alert = new Alert()
        this._controls = new SliderControls()
    }

    init() {
        this._controls.init()
    }

    async read() {
        const track = await currentData.readTrack()
        return track
    }

    reset() {
        this._controls.setInitialValues()
    }

    async _delete() {
        await this._store.deleteTrack(this._defaultTrack)
        this._updateView()
    }

    async _updateView(initData = null) {
        const response = initData ?? await this.read()
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

    async _share() {
        const { startTime, endTime, playbackRate = '1.00', preservesPitch = true } = await this.read()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 1000

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
            title: document.getElementById('track-title'),
            artists: document.getElementById('track-artists'),
            inputRight: document.getElementById('input-end'),
            inputLeft: document.getElementById('input-start'),
        }
    }

    displayAlert() {
        this._alert.displayAlert()
    }

    _setTrackInfo({ title, artists }) {
        setTrackInfo({ title, artists, chorusView: true })
    }
}
