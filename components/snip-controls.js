const createSnipControls = ({ current, duration }) => `
    <div id="chorus-snip-controls" style="display: block">
        ${createHeader()}
        ${createSlider({ current, duration })}
        ${createLabels()}
        ${createActionButtons()}
    </div>
`
