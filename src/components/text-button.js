export const createTextButton = ({ id, text, style }) => `
    <button
        id="chorus-${id}-button"
        class="chorus-text-button"
        style="padding:0 10px;height:100%;font-size:1rem;${style || ''}"
    >
        <span>${text}</span>
    </button>
`

