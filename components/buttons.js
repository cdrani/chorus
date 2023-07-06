const createActionButtons = () => {
    return `
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
            <div style="justify-content: space-between">
                <button
                    class="chorus-text-button"
                    id="chorus-remove-button"
                    style="visibility: hidden;margin-right: 0.5rem; font-size: 1rem; padding:0 4px"
                >
                    remove
                </button>
                <button
                    id="chorus-save-button"
                    class="chorus-text-button"
                    style="font-size: 1rem; padding:0 4px"
                >
                    save
                </button>
            </div>
        </div>
    `
}
