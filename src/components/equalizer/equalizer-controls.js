import { createEqualizerButtons } from './equalizer-buttons.js'
import { createSelector, createSelectorPreset } from '../selector.js'
import { customPresets, spotifyPresets } from '../../lib/equalizer/presets.js'

export const createEqualizerControls = () => `
    <div id="chorus-eq-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createSelector({ name: 'spotify-equalizer', labelName: 'Spotify EQ Presets', optionNames: spotifyPresets })}
            ${createSelector({ name: 'custom-equalizer', labelName: 'Custom EQ Presets', optionNames: customPresets })}
            ${createSelectorPreset({ id: 'equalizer', text: 'Active EQ Preset' })}
        </div>
        ${createEqualizerButtons()}
    </div>
`
