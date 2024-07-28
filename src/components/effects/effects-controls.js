import { createSelector } from '../selector.js'
import { createEffectsButtons } from './effects-button.js'
import { convolverPresets, roomPresets } from '../../lib/reverb/presets.js'

export const createEffectsControls = () => `
    <div id="chorus-fx-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createSelector({ name: 'room-effect', labelName: 'room-sized reverb', optionNames: roomPresets })}
            ${createSelector({ name: 'convolver-effect', labelName: 'impulse reverb', optionNames: convolverPresets })}

            <hr/>
            <div style="font-size:1rem;color:#b3b3b3;">
                <p style="display:flex;justify-content:space-between;width:100%;padding-right:.125rem;">
                    effect <span id="reverb-preset-selection" style="color:#fff"></span>
                </p>
            </div>
        </div>
        ${createEffectsButtons()}
    </div>
`
