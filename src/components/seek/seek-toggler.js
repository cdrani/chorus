import { createToggleButton } from '../toggle-button.js'

export const createSeekToggler = () => `
    <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
        <div style="display:flex;justify-content:space-between;">
            <div style="display:flex;align-items:center;">
                <span class="chorus-text chorus-pill" style="background:green">D</span>
            </div>

            <div style="display:flex;align-items:center;">
                <span class="chorus-text chorus-pill">P</span>
            </div>
        </div>

        <div>
            <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
                ${
                    createToggleButton({ 
                        labelId: 'seek-label',
                        labelText: 'Podcast Seeking',
                        onPathId: 'seek-toggle-on',
                        offPathId: 'speed-toggle-off',
                        checkboxId: 'speed-checkbox',
                        buttonId: 'speed-toggle-button',
                    })
                }
            </div>
        </div>
    </div>
`

