import { createToggleButton } from '../components/toggle-button.js'

class ExtToggle {
    get ui() {
        return createToggleButton({
            onPathId: 'ext-toggle-on',
            offPathId: 'ext-toggle-off',
            checkboxId: 'ext-checkbox',
            buttonId: 'ext-toggle-button',
        })
    }

    setupEvents() {
        const { extToggleButton } = this.elements
        extToggleButton.onclick = () => this.#toggleExtCheckbox()
    }

    #setCheckedUI(extChecked) {
        const { extCheckbox, extToggleOn, extToggleOff } = this.elements

        extToggleOn.style.display = extChecked ? 'block' : 'none'
        extToggleOff.style.display = extChecked ? 'none' : 'block'

        extCheckbox.checked = extChecked
    }

    #toggleExtCheckbox() {
        const { extCheckbox } = this.elements

        extCheckbox.checked = !extCheckbox.checked
        const { checked } = extCheckbox
        this.#setCheckedUI(checked)
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
