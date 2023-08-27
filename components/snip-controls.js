import { createSlider } from './slider.js'
import { createRangeLabels } from './snip-labels.js'
import { createSnipButtons } from './snip-buttons.js'

import { playback } from '../utils/playback.js'

export const createSnipControls = () => {
    const current = playback.current()
    const duration = playback.duration()

    return `
        <div id="chorus-snip-controls" style="display: block">
            ${createSlider({ current, duration })}
            ${createRangeLabels()}
            ${createSnipButtons()}
        </div>
    `
}
