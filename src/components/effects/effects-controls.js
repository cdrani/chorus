import { createEffectsButtons } from './effects-button.js'
import { createEffectsSelector } from './effects-selector.js'

import { drinkPresetNames } from '../../lib/reverb/presets.js'
export const createEffectsControls = () => `
    <div id="chorus-effects-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-evenly;height:6rem;">
            <div style="font-size:.75rem;color:#fafafa">
                <p>
                    Presets For Reverb Effects. Pair With Speed & Pitch 
                    Correction Combos for New Aural Experiences.
                </p> 
            </div>
            ${createEffectsSelector({
                name: 'drink-effect',
                labelName: 'Drink Size',
                optionNames: drinkPresetNames
            })}
        </div>
        ${createEffectsButtons()}
    </div>
`
