import { createTextButton } from '../text-button.js'

export const createSnipButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createTextButton({ id: 'snip-share', text: 'share', style: 'display:flex;padding:0 10px' })}
        <div style="display:flex;justify-content:flex-end">
            <div style="display:flex;align-items:center;justify-content:space-between">
                ${createTextButton({ 
                      text: 'remove', 
                      id: 'snip-remove',
                      style: 'margin-right:0.5rem;display:flex'
                })}
                ${createTextButton({ id: 'snip-save', text: 'save' })}
            </div>
        </div>
    </div>
`
