const createButton = ({ text, style }) => `
    <button
        class="chorus-text-button"
        id="chorus-snip-${text}-button"
        style="padding:0 10px;height:100%;font-size:1rem;${style || ''}"
    >
        <span>${text}</span>
    </button>
`

export const createSnipButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        ${createButton({ text: 'share', style: 'display:flex;padding:0 10px' })}
        <div style="display:flex;justify-content:flex-end">
            <div style="display:flex;align-items:center;justify-content:space-between">
                ${createButton({ text: 'remove', style: 'margin-right:0.5rem;display:flex' })}
                ${createButton({ text: 'save' })}
            </div>
        </div>
    </div>
`
