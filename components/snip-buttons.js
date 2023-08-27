export const createSnipButtons = () => `
    <div style="display:flex;margin-top:12px;justify-content:space-between;height:1.5rem;">
        <button
            class="chorus-text-button"
            id="chorus-snip-share-button"
            style="display:flex;padding:0 10px;height:100%;font-size:1rem;"
        >
            <span>share</span>
        </button>
        <div style="display:flex;justify-content:flex-end">
            <div style="display:flex;align-items:center;justify-content:space-between">
                <button
                    class="chorus-text-button"
                    id="chorus-snip-remove-button"
                    style="padding:0 10px;height:100%;margin-right:0.5rem;font-size:1rem;"
                >
                    <span>remove</span>
                </button>
                <button
                    id="chorus-snip-save-button"
                    class="chorus-text-button"
                    style="font-size:1rem;padding:0 10px;height:100%;"
                >
                    <span>save</span>
                </button>
            </div>
        </div>
    </div>
`
