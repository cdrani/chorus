import SnipControls from './snip-controls.js'
import ButtonListeners from '../../events/listeners.js'

export default class Snip {
    constructor(store) {
        this._store = store
        this._controls = new SnipControls()
        this._listeners = new ButtonListeners(this)
    }

    init() {
        this._listeners.init()
        this.isEditing = true
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

    _displayAlert() {
        const alertBox = document.getElementById('chorus-alert') 
        const alertMessage = alertBox.querySelector('[id="chorus-alert-message"]')

        alertMessage.textContent = `Snip copied to clipboard.`
        alertBox.style.display = 'flex' 
        setTimeout(() => { alertBox.style.display = 'none' }, 3000)
    }

    _setTrackInfo({ title, artists }) {
        const titleElement = document.getElementById('track-title')
        const artistsElement = document.getElementById('track-artists')

        titleElement.textContent = title
        artistsElement.textContent = artists
    }
}
