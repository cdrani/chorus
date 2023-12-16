import { createSlider } from './snip-slider.js'
import { createRangeLabels } from './snip-labels.js'
import { createSnipToggler } from './snip-toggle.js'
import { createSnipButtons } from './snip-buttons.js'

import { playback } from '../../utils/playback.js'

export const createSnipControls = () => {
    const current = playback.current()
    const duration = playback.duration()

    return `
        <div id="chorus-snip-controls" style="display: block">
            ${createSlider({ current, duration })}
            <div style="display:flex;justify-content:space-between;height:3rem;">
                ${createRangeLabels()}
                ${createSnipToggler()}
            </div>
            ${createSnipButtons()}
        </div>
    `
}
