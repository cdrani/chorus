import { createTextButton } from '../text-button.js'

export const createSeekButtons = () => ` 
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createTextButton({ id: 'seek-reset', text: 'reset' })}
        ${createTextButton({ id: 'seek-save', text: 'save' })}
    </div>
`
