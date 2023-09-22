import { createToggleButton } from '../toggle-button.js'

const createTag = ({ tag, id, text, style = '' }) => `
    <div style="display:flex;align-items:center;${style}">
        <span class="chorus-text chorus-pill">${tag}</span>
        <span class="chorus-text" id="${id}" style="height:100%;margin-left:4px;padding:0 4px">${text}</span>
    </div>
`

export const createSpeedToggler = () => `
    <div style="display:flex;justify-content:space-between;align-items:center;width:100%">
        <div style="display:flex;flex-direction:column;justify-content:space-between;">
            ${createTag({ tag: 'T', id: 'speed-track-value', text: '1x', style: 'margin-bottom:4px' })}
            ${createTag({ tag: 'G', id: 'speed-global-value', text: '1x' })}
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
