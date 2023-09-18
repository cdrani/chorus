import { createControls } from '../components/controls.js'
import { SETTINGS_ICON, createIcon } from '../components/icons/icon.js'

export default class Icon {
    constructor() {}

    // TODO: Icon should not be concerned with creating the main UI
    createRootContainer() {
        return `
            <div id="chorus">
                ${this.#createIcon()}
                <div id="chorus-main" style="display: none">
                    ${createControls()}
                </div>
            </div>
        `
    }

    #createIcon() {
        return createIcon(SETTINGS_ICON)
    }
}
