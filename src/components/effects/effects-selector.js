const createOptions = optionNames => (
    optionNames.map(name => `<option name="${name}" value="${name}">${name}</option>`).join('')
)

export const createEffectsSelector = ({ labelName, name, optionNames }) => `
    <div style="display:flex;justify-content:space-between">
        <label style="color:#b3b3b3;font-size:">${labelName}</label>

        <form id="select-container" class="selector">
            <select 
                class="select"
                id="${name}-presets"
                name="${name}-presets"
                style="margin-left:1rem;font-size:1rem;text-align:end"
            >
                ${createOptions(optionNames)}
            </select>
        </form>
    </div>
`
