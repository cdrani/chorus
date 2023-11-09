import { createEffectsButtons } from './effects-button.js'
import { createEffectsSelector } from './effects-selector.js'

import { drinkPresetNames } from '../../lib/reverb/presets.js'
export const createEffectsControls = () => `
    <div id="chorus-effects-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;">
            ${createEffectsSelector({
                name: 'drink-effect',
                labelName: '"Drink" Reverb',
                optionNames: drinkPresetNames
            })}
        </div>
        ${createEffectsButtons()}
    </div>
`
