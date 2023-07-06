const createSnipControls = ({ current, duration }) => `
    <div id="chorus-snip-controls" style="display: block">
        ${createHeader({ snip: true })}
        ${createSlider({ snip: true, current, duration })}

        ${createInputs({ snip: true })}
        ${createActionButtons({ snip: true })}
    </div>
`
