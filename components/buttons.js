export const createActionButtons = () => `
    <div style="display:flex;justify-content:flex-end; margin-top:12px">
        <div style="display:flex;align-items:center;justify-content:space-between">
            <button
                class="chorus-text-button"
                id="chorus-remove-button"
                style="display:none;padding:0 10px;height:100%;margin-right:0.5rem;font-size:1rem;"
            >
                <span>remove</span>
            </button>
            <button
                id="chorus-save-button"
                class="chorus-text-button"
                style="font-size:1rem;padding:0 10px;height:100%;"
            >
                <span>save</span>
            </button>
        </div>
    </div>
`
