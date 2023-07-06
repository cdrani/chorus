const createInputs = ({ snip = false }) => {
    const type = snip ? 'text' : 'number'
    const text = { left: snip ? 'start' : 'min', right: snip ? 'end' : 'max' }
    const defaultPlaceholder = { left: snip ? '0:00' : 1, right: snip ? '' : 2 }

    return `
        <div style="display: flex; justify-content: space-between">
            <div style="display: flex; flex-wrap: wrap; max-width: 100px;">
                <label class="chorus-common" style="width: 100%">
                    ${text.left}:<div style="flex-grow: 1;"></div>
                    <input
                        type="${type}"
                        id="chorus-${text.left}"
                        name="chorus-${text.left}"
                        placeholder="${defaultPlaceholder.left}"
                        style="min-width:50px;margin-left:10px;text-align:end;padding:0 3px"
                    >
                </label>
            </div>

            <div style="display: flex; flex-wrap: wrap; max-width: 100px;">
                <label class="chorus-common" style="width: 100%">
                    ${text.right}:<div style="flex-grow: 1;"></div>
                    <input
                        type="${type}"
                        id="chorus-${text.right}"
                        name="chorus-${text.right}"
                        placeholder="${defaultPlaceholder.right}"
                        style="min-width:50px;margin-left:10px;text-align:end;padding:0 3px"
                    >
                </label>
            </div>
        </div>
    `
}
