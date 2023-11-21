import { store } from '../../stores/data.js'
import SliderControls from '../slider/slider-controls.js'

import { timeToSeconds } from '../../utils/time.js'
import { currentData } from '../../data/current.js'
import { setTrackInfo } from '../../utils/track-info.js'

export default class Snip {
    constructor() {
        this._store = store
        this._controls = new SliderControls()
    }

    init() { this._controls.init() }

    async read() {
        const track = await currentData.readTrack()
        return track
    }

    reset() { this._controls.setInitialValues() }

    async delete() { await this._snipSave.delete() }

    async _updateView(initData = null) {
        const response = initData ?? await this.read()
        const { isSnip, isSkipped } = response

        this.#setUpdateControls(response)
        this.#toggleRemoveButton(isSnip || isSkipped)
    }

    get tempShareTimes() {
        const tempEndTime = document.getElementById('chorus-end')?.textContent
        const tempStartTime = document.getElementById('chorus-start')?.textContent
        return { tempEndTime: timeToSeconds(tempEndTime), tempStartTime: timeToSeconds(tempStartTime) }
    }

    async share() {
        const { tempEndTime, tempStartTime } = this.tempShareTimes
        await this._snipSave.share({ tempStartTime, tempEndTime })
    }

    #toggleRemoveButton(showRemove) {
        const removeButton = document.getElementById('chorus-snip-remove-button')
        if (!removeButton) return

        removeButton.style.display = showRemove ? 'block' : 'none'
    }

    #setUpdateControls(response) { this._controls.updateControls(response) }

    get _elements() {
        return {
            title: document.getElementById('track-title'),
            artists: document.getElementById('track-artists'),
            inputRight: document.getElementById('input-end'),
            inputLeft: document.getElementById('input-start'),
        }
    }

    _setTrackInfo({ title, artists }) { setTrackInfo({ title, artists, chorusView: true }) }
}
