import { createTextButton } from '../text-button.js'

export const createEffectsButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:flex-end;height:1.5rem;">
        ${createTextButton({ text: 'save', id: 'effects-save' })}
    </div>
`

// ${createTextButton({ text: 'reset', id: 'effects-reset' })}
