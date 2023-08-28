import { createSpeedRange } from './speed-range.js'
import { createSpeedToggler } from './speed-toggler.js'
import { createSpeedButtons } from './speed-buttons.js'

export const createSpeedControls = () => `
    <div id="chorus-speed-controls" style="display: none">
        ${createSpeedRange()}
        ${createSpeedToggler()}
        ${createSpeedButtons()}
    </div>
`
