import { createToggleButton } from '../components/toggle-button.js'
import { setState } from '../utils/state.js'

class ExtToggle {
    get ui() {
        return createToggleButton({
            onPathId: 'ext-toggle-on',
            offPathId: 'ext-toggle-off',
            checkboxId: 'ext-checkbox',
            buttonId: 'ext-toggle-button',
        })
    }

    initialize(checked) {
        this.#setCheckedUI(checked)
    }

    setupEvents() {
        const { extToggleButton } = this.elements
        extToggleButton.onclick = async () => await this.#toggleExtCheckbox()
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

    async #toggleExtCheckbox() {
        const { extCheckbox } = this.elements

        extCheckbox.checked = !extCheckbox.checked
        const { checked } = extCheckbox
        await this.#setCheckedUI(checked)
    }

    get elements() {
        return {
            extToggleOn: document.getElementById('ext-toggle-on'),
            extToggleOff: document.getElementById('ext-toggle-off'),

            extCheckbox: document.getElementById('ext-checkbox'),
            extToggleButton: document.getElementById('ext-toggle-button'),
        }
    }
}

export const extToggle = new ExtToggle()
