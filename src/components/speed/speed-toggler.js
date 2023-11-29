import { createToggleButton } from '../toggle-button.js'

const createTag = ({ tag, id, style = '' }) => `
    <div style="display:flex;align-items:center;${style};">
        <span class="chorus-text chorus-pill" style="text-align:left;width:46px;padding-left:4px">${tag}</span>
        <input id="${id}" class="chorus-text" style="color:#fff;width:42px;height:100%;padding:0 4px">
    </div>
`

export const createSpeedToggler = () => `
    <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <div style="display:flex;flex-direction:column;justify-content:space-between;">
            ${createTag({ tag: 'Track', id: 'speed-track-value', style: 'margin-bottom:4px' })}
            ${createTag({ tag: 'Global', id: 'speed-global-value' })}
        </div>

        <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
            ${createToggleButton({ 
                labelId: 'speed-label',
                labelText: 'Global Rate',
                onPathId: 'speed-toggle-on',
                offPathId: 'speed-toggle-off',
                checkboxId: 'speed-checkbox',
                buttonId: 'speed-toggle-button',
            })}
            ${createToggleButton({ 
                labelId: 'pitch-label',
                labelText: 'Pitch Correct',
                onPathId: 'pitch-toggle-on',
                offPathId: 'pitch-toggle-off',
                checkboxId: 'pitch-checkbox',
                buttonId: 'pitch-toggle-button',
            })}
        </div>
    </div>
`
