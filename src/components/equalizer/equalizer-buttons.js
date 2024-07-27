import { createTextButton } from '../text-button.js'

export const createEqualizerButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createTextButton({ text: 'reset', id: 'equalizer-reset' })}
        ${createTextButton({ text: 'save', id: 'equalizer-save' })}
    </div>
`
