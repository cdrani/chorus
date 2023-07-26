import SnipControls from './snip-controls.js'
import ButtonListeners from '../../events/listeners.js'

export default class Snip {
    #store

    constructor(store) {
        this.#store = store
        this._controls = new SnipControls()
        this._listeners = new ButtonListeners(this)
    }

    init() {
        this._listeners.init()
    }

    read() {
        return this.#store.getTrack(this._defaultTrack)
    }

    reset() {
        this._controls.setInitialValues()
    }

    async delete() {
        await this.#store.deleteTrack(this._defaultTrack)
        this.updateView()
    }

    _updateView() {
        const response = this.read()
        this.#setUpdateControls(response)
        this._highlightSnip(response?.isSnip)
        this.#toggleRemoveButton(response?.isSnip)
    }

    #toggleRemoveButton(isSnip) {
        const removeButton = document.getElementById('chorus-remove-button')

        if (!removeButton) return
        removeButton.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    #setUpdateControls(response) {
        this._controls.updateControls(response)
    }
}
