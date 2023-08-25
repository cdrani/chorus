import { createToggleButton } from './toggle-button.js'

export const createSpeedToggler = () => `
    <div style="display:flex;justify-content:space-between;align-items:center;width:100%">

        <div style="display:flex;flex-direction:column;justify-content:space-between;">
            <div style="display:flex;align-items:center;margin-bottom:4px">
                <span class="chorus-text chorus-pill">T</span>
                <span class="chorus-text" id="speed-track-value" style="height:100%;margin-left:4px;padding:0 4px">1x</span>
            </div>

            <div style="display:flex;align-items:center;">
                <span class="chorus-text chorus-pill">G</span>
                <span class="chorus-text" id="speed-global-value" style="height:100%;margin-left:4px;padding:0 4px;">1x</span>
            </div>
        </div>


        <div>
        <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
            ${
                createToggleButton({ 
                    labelId: 'speed-label',
                    labelText: 'Global Rate',
                    onPathId: 'speed-toggle-on',
                    offPathId: 'speed-toggle-off',
                    checkboxId: 'speed-checkbox',
                    buttonId: 'speed-toggle-button',
                })
            }
            ${
                createToggleButton({ 
                    labelId: 'pitch-label',
                    labelText: 'Pitch Correct',
                    onPathId: 'pitch-toggle-on',
                    offPathId: 'pitch-toggle-off',
                    checkboxId: 'pitch-checkbox',
                    buttonId: 'pitch-toggle-button',
                })
            }
        </div>
        </div>
    </div>
`
