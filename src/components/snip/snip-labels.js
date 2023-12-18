const style = 'border:none;width:82px;font-size:0.75rem;margin-left:8px;text-align:center;background:green;color:#fff;'

const createLabel = text => `
    <div class="chorus-common" style="display:flex;align-items:center;height:22px;">
        <span class="chorus-text chorus-pill" style="font-size:1rem;line-height:22px;height:100%;text-align:center;width:56px;padding:0 4px">
            ${text}
        </span>
        <input id="chorus-${text}" class="chorus-text" style="padding:0 6px;width:100%;text-align:end;background:green;border:none;color:#fff;height:100%;">
    </div>
`

    // <div>
    //     <label class="chorus-common" style="width:100%;align-items:end;height:22px;">
    //         ${text}: <input class="chorus-text" style="height:100%;${style}" id="chorus-${text}"/>
    //     </label>
    // </div>
export const createRangeLabels = () => `
    <div style="display:flex;flex-direction:column;justify-content:space-between;width:100%">
        ${createLabel('start')}
        ${createLabel('end')}
    </div>
`
