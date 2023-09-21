const style = "min-width:24px;font-size:0.85rem;height:100%;text-align:end;margin-left:4px"

const createLabel = text => `
    <div>
        <label class="chorus-common" style="width:100%">
            ${text}: <span style="${style}" id="chorus-${text}"></span>
        </label>
    </div>
`

export const createRangeLabels = () => `
    <div style="display:flex;justify-content:space-between;height:3rem;align-items:center;">
        ${createLabel('start')}
        ${createLabel('end')}
    </div>
`
