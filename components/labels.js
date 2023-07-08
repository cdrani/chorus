const style = "min-width:24px;font-size:0.85rem;height:100%;text-align:end;margin-left:4px"

const createLabels = () => `
    <div style="display: flex; justify-content: space-between">
        <div style="display: flex; flex-wrap: wrap; max-width: 100px;">
            <label class="chorus-common" style="width: 100%">
                start:
                <span
                    id="chorus-start"
                    style="${style}"
                ></span>
            </label>
        </div>

        <div style="display: flex; flex-wrap: wrap; max-width: 100px;">
            <label class="chorus-common" style="width: 100%">
                end:
                <span
                    id="chorus-end"
                    style="${style}"
                ></span>
            </label>
        </div>
    </div>
`
