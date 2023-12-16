const style = 'width:90px;font-size:0.85rem;margin-left:8px;text-align:center;background:green;color:#fff;'

const createLabel = text => `
    <div>
        <label class="chorus-common" style="width:100%;align-items:end">
            ${text}: <input style="${style}" id="chorus-${text}"/>
        </label>
    </div>
`

export const createRangeLabels = () => `
    <div style="display:flex;flex-direction:column;justify-content:space-between;">
        ${createLabel('start')}
        ${createLabel('end')}
    </div>
`
