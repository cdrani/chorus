import { createSelector } from '../selector.js'
import { eqPresetLabels } from '../../lib/equalizer/presets.js'
import { createEqualizerButtons } from './equalizer-buttons.js'

export const createEqualizerControls = () => `
    <div id="chorus-eq-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createSelector({ name: 'equalizer-effect', labelName: 'Equalizer Preset', optionNames: eqPresetLabels })}

            <hr/>
            <div style="font-size:1rem;color:#b3b3b3;">
                <p style="display:flex;justify-content:space-between;width:100%;padding-right:.125rem;">
                    effect <span id="equalizer-preset-selection" style="color:#fff"></span>
                </p>
            </div>
        </div>
        ${createEqualizerButtons()}
    </div>
`
