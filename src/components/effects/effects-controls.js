import { createEffectsButtons } from './effects-button.js'
import { createEffectsSelector } from './effects-selector.js'
import { convolverPresets, drinkPresets } from '../../lib/reverb/presets.js'

export const createEffectsControls = () => `
    <div id="chorus-fx-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createEffectsSelector({ name: 'drink-effect', labelName: 'cup-sized reverb', optionNames: drinkPresets })}
            ${createEffectsSelector({ name: 'convolver-effect', labelName: 'impulse reverb', optionNames: convolverPresets })}

            <hr/>
            <div style="font-size:1rem;color:#b3b3b3;">
                <p style="display:flex;justify-content:space-between;width:100%;padding-right:.125rem;">
                    effect <span id="preset-selection" style="color:#fff"></span>
                </p>
            </div>
        </div>
        ${createEffectsButtons()}
    </div>
`
