import { createToggleButton } from '../components/toggle-button.js'
import { setState } from '../utils/state.js'

class ExtToggle {
    constructor() {
        this._on = false
        this._eventsSet = false
    }

    set on(enabled) {
        this._on = enabled 
    }

    get ui() {
        return createToggleButton({
            onPathId: 'ext-toggle-on',
            offPathId: 'ext-toggle-off',
            checkboxId: 'ext-checkbox',
            buttonId: 'ext-toggle-button',
        })
    }

    async initialize(checked, callback) {
        this.on = checked
        await this.#setCheckedUI(checked)
        if (!checked) callback()
    }

    setupEvents(callback) {
        const { extToggleButton } = this.elements
        if (this._eventsSet) return

        extToggleButton.onclick = async () =>  {
            await this.#toggleExtCheckbox(callback)
        }
        this._eventsSet = true 
    }

    setFill(fillColor) {
        const { extToggleOn, extToggleOff } = this.elements
        extToggleOn.style.fill = fillColor
        extToggleOff.style.fill = fillColor
    }

    async #setCheckedUI(extChecked) {
        const { extCheckbox, extToggleOn, extToggleOff } = this.elements

        extToggleOn.style.display = extChecked ? 'block' : 'none'
        extToggleOff.style.display = extChecked ? 'none' : 'block'

        extCheckbox.checked = extChecked
        await setState({ key: 'enabled', value: extChecked })
    }

    async #toggleExtCheckbox(callback) {
        const { extCheckbox } = this.elements

        const checked = !this._on
        this.on = checked
        extCheckbox.checked = checked
        await this.#setCheckedUI(checked)

        await callback(checked)
    }

    get elements() {
        return {
            extToggle: document.getElementById('chorus-toggle'),
            extToggleOn: document.getElementById('ext-toggle-on'),
            extToggleOff: document.getElementById('ext-toggle-off'),

            extCheckbox: document.getElementById('ext-checkbox'),
            extToggleButton: document.getElementById('ext-toggle-button'),
        }
    }
}

export const extToggle = new ExtToggle()
