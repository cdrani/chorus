import { createSeekInputs } from './seek-inputs.js'
import { createSeekButtons } from './seek-buttons.js'
import { createToggleButton } from '../toggle-button.js'
import { createSeekToggler } from './seek-toggler.js'

export const createSeekControls = () => `
    <div id="chorus-seek-controls" style="display: none">
        <div style="margin:.75rem 0">
            ${createSeekInputs()}
        </div>
        <div style="margin-bottom:.75rem">
            ${createSeekToggler()}
        </div>
        ${createSeekButtons()}
    </div>
`
