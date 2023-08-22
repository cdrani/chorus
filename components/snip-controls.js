import { createSlider } from './slider.js'
import { createRangeLabels } from './labels.js'
import { createActionButtons } from './buttons.js'

import { playback } from '../utils/playback.js'

export const createSnipControls = () => {
    const current = playback.current()
    const duration = playback.duration()

    return `
        <div id="chorus-snip-controls" style="display: block">
            ${createSlider({ current, duration })}
            ${createRangeLabels()}
            ${createActionButtons()}
        </div>
    `
}
