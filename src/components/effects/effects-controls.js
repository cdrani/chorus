import { createEffectsButtons } from './effects-button.js'
import { createSelector, createSelectorPreset } from '../selector.js'
import { convolverPresets, roomPresets } from '../../lib/reverb/presets.js'

export const createEffectsControls = () => `
    <div id="chorus-fx-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createSelector({ name: 'room-effect', labelName: 'room-sized reverb', optionNames: roomPresets })}
            ${createSelector({ name: 'convolver-effect', labelName: 'impulse reverb', optionNames: convolverPresets })}
            ${createSelectorPreset({ id: 'reverb', text: 'Active Reverb Preset' })}
        </div>
        ${createEffectsButtons()}
    </div>
`
