import { store } from '../../stores/data.js'

import Alert from '../alert.js'
import SliderControls from '../slider/slider-controls.js'

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
        this._highlightSnip(isSnip)
        this.#toggleRemoveButton(isSnip || isSkip)
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

    _displayAlert() {
        this._alert.displayAlert()
    }

    _setTrackInfo({ title, artists }) {
        const titleElement = document.getElementById('track-title')
        const artistsElement = document.getElementById('track-artists')

        titleElement.textContent = title
        artistsElement.textContent = artists
    }
}
