import { createToggleButton } from '../toggle-button.js'

export const createSeekToggler = () => `
    <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
        <div style="display:flex;justify-content:space-between;">
            <div style="display:flex;align-items:center;">
                <span id="seek-global-label" class="chorus-text chorus-pill" style="background:green">G</span>
            </div>

            <div style="display:flex;align-items:center;">
                <span id="seek-shows-label" class="chorus-text chorus-pill">PA</span>
            </div>
        </div>

        <div>
            <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
                ${
                    createToggleButton({ 
                        labelId: 'seek-label',
                        labelText: 'Global',
                        onPathId: 'seek-toggle-on',
                        offPathId: 'seek-toggle-off',
                        checkboxId: 'seek-checkbox',
                        buttonId: 'seek-toggle-button',
                    })
                }
            </div>
        </div>
    </div>
`

