import { createTextButton } from '../text-button.js'

export const createSpeedButtons = () => ` 
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createTextButton({ id: 'speed-reset', text: 'reset' })}
        ${createTextButton({ id: 'speed-save', text: 'save' })}
    </div>
`
