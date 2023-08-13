import { createHeader } from './header.js'
import { createSlider } from './slider.js'
import { createRangeLabels } from './labels.js'
import { createTrackInfo } from './track-info.js'
import { createActionButtons } from './buttons.js'

export const createSnipControls = ({ current, duration }) => `
    <div id="chorus-snip-controls" style="display: block">
        ${createHeader()}
        ${createTrackInfo()}
        ${createSlider({ current, duration })}
        ${createRangeLabels()}
        ${createActionButtons()}
    </div>
`
