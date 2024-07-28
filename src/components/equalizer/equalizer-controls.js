import { createSelector } from '../selector.js'
import { createEqualizerButtons } from './equalizer-buttons.js'
import { customPresets, spotifyPresets } from '../../lib/equalizer/presets.js'

export const createEqualizerControls = () => `
    <div id="chorus-eq-controls" style="display: none">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:5.5rem;">
            ${createSelector({ name: 'spotify-equalizer', labelName: 'Spotify EQ Presets', optionNames: spotifyPresets })}
            ${createSelector({ name: 'custom-equalizer', labelName: 'Custom EQ Presets', optionNames: customPresets })}

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
