import { createTextButton } from '../text-button.js'

export const createEffectsButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createTextButton({ text: 'reset', id: 'effects-reset' })}
        ${createTextButton({ text: 'save', id: 'effects-save' })}
    </div>
`
