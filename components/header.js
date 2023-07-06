const createHeader = ({ snip = true }) => `
    <div class="chorus-common">
        <span class="chorus-header">chorus</span>
        <div style="flex-grow: 1;"></div>
        <div style="display: flex; justify-content: flex-end;">
            <div style="justify-content: space-between">
                <button id="chorus-close-button" class="chorus-text-button">X</button>
            </div>
        </div>
    </div>
`

// <button
//     id="chorus-${snip ? 'snip' : 'speed'}-button"
//     class="chorus-text-button"
// >
//     ${snip ? 'SNIP' : 'SPEED'}
// </button>
