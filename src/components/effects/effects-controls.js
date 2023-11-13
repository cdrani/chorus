import { createEffectsButtons } from './effects-button.js'
import { createEffectsSelector } from './effects-selector.js'
import { convolverPresets, drinkPresets } from '../../lib/reverb/presets.js'

export const createEffectsControls = () => `
    <div id="chorus-effects-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-evenly;height:6rem;">
            ${createEffectsSelector({ name: 'drink-effect', labelName: 'Drink Size', optionNames: drinkPresets })}
            ${createEffectsSelector({ name: 'convolver-effect', labelName: 'Convolver', optionNames: convolverPresets })}

            <div style="font-size:1rem;color:#b3b3b3;text-transform:capitalize">
                <p style="display:flex;justify-content:space-between;width:100%;padding-right:.125rem;">
                    Effect: <span id="preset-selection" style="color:#fff"></span>
                </p>
            </div>
        </div>
        ${createEffectsButtons()}
    </div>
`
