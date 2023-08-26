export default class RangeSlider {
    #video
    #data

    constructor(video) {
        this.#video = video
    }

    init(data) {
        if (!this.#data) {
            this.#setupEvents()
        }

        const { track, globals, preferredRate, preferredPitch } = data
        const { 
            input, speedTrackValue, speedGlobalValue, speedCheckbox, pitchCheckbox
        } = this.elements

        input.value = preferredRate
        this.#setSpeedValue({ playbackRate: preferredRate, preservesPitch: preferredPitch })

        speedCheckbox.checked = !track?.playbackRate
        pitchCheckbox.checked = track?.preservesPitch ?? preferredPitch

        speedTrackValue.textContent = `${this.#padValue(track?.playbackRate || 1)}x`
        speedGlobalValue.textContent = `${this.#padValue(globals?.playbackRate || 1)}x`

        this.#hightlightSpeedValue(speedCheckbox.checked)

        this.#data = data
    }

    // TODO: move into utils
    #padValue(value, decimalPlace = 2) {
        if (isNaN(parseFloat(value))) {
           return value // If not a valid number, return the input value.
        }

        // Convert the value to a number and then format it with two decimal places.
        return parseFloat(value).toFixed(decimalPlace);
    }
    
    #setupEvents() {
        const { 
            input, thumb, pitchToggleButton, speedToggleButton,
        } = this.elements

        input.oninput = () => this.#setSpeedValue({})

        input.addEventListener('mouseover', () => thumb.classList.add('hover'))
        input.addEventListener('mouseout', () => thumb.classList.remove('hover'))
        input.addEventListener('mousedown', () => thumb.classList.add('active'))
        input.addEventListener('mouseup', () => thumb.classList.remove('active'))

        speedToggleButton.onclick = () => this.#toggleSpeedCheckbox()
        pitchToggleButton.onclick = () => this.#togglePitchCheckbox()
    }

    #toggleSpeedCheckbox() {
        const { 
            input, speedCheckbox, speedToggleOn, speedToggleOff,
            speedLabel, speedTrackValue, speedGlobalValue
        } = this.elements
        speedCheckbox.checked = !speedCheckbox.checked

        const { checked } = speedCheckbox
        speedToggleOn.style.display = checked ? 'block' : 'none'
        speedToggleOff.style.display = checked ? 'none' : 'block'
        speedLabel.textContent = checked ? 'Global Speed' : 'Track Speed'

        const { track, globals } = this.#data
        
        input.value = checked
            ? parseFloat(speedGlobalValue.textContent) || globals?.playbackRate || 1
            : parseFloat(speedTrackValue.textContent)|| track?.playbackRate || 1

        this.#video.currentSpeed = input.value

        this.#hightlightSpeedValue(checked)
        this.#setSpeedValue({ playbackRate: input.value })
    }

    #hightlightSpeedValue(checked) {
        const { speedTrackValue, speedGlobalValue } = this.elements

        if (checked) {
            speedGlobalValue.parentElement.style.background = 'green'
            speedTrackValue.parentElement.style.background = 'unset'
        } else {
            speedGlobalValue.parentElement.style.background = 'unset'
            speedTrackValue.parentElement.style.background = 'green'
        }
    }

    #togglePitchCheckbox() {
        const { pitchCheckbox, pitchToggleOn, pitchToggleOff } = this.elements
        pitchCheckbox.checked = !pitchCheckbox.checked

        const { checked } = pitchCheckbox
        pitchToggleOn.style.display = checked ? 'block' : 'none'
        pitchToggleOff.style.display = checked ? 'none' : 'block'

        this.#video.preservesPitch = checked
    }

    get elements() {
        return {
            range: document.getElementById('speed-range'),
            thumb: document.getElementById('speed-thumb'),
            input: document.getElementById('speed-input'),
            minOutput: document.getElementById('speed-min'),
            maxOutput: document.getElementById('speed-max'),

            speedLabel: document.getElementById('speed-label'),

            speedTrackValue: document.getElementById('speed-track-value'),
            speedGlobalValue: document.getElementById('speed-global-value'),

            speedCheckbox: document.getElementById('speed-checkbox'),
            speedToggleOn: document.getElementById('speed-toggle-on'),
            speedToggleOff: document.getElementById('speed-toggle-off'),
            speedToggleButton: document.getElementById('speed-toggle-button'),

            pitchCheckbox: document.getElementById('pitch-checkbox'),
            pitchToggleOn: document.getElementById('pitch-toggle-on'),
            pitchToggleOff: document.getElementById('pitch-toggle-off'),
            pitchToggleButton: document.getElementById('pitch-toggle-button')
        }
    }

    #setSpeedValue({ playbackRate, preservesPitch }) {
        const { 
            input, speedCheckbox, pitchCheckbox, range, thumb,
            speedTrackValue, speedGlobalValue,
            minOutput, maxOutput
        } = this.elements

        const value = playbackRate ?? input.value
        const pitchPreserved = preservesPitch ?? pitchCheckbox?.checked
        const percent = ((value - input.min) / (input.max - input.min)) * 100

        thumb.style.right = `${100 - percent}%`
        range.style.right = `${100 - percent}%`

        minOutput.textContent = `${input.min}x`
        maxOutput.textContent = `${input.max}x`

        if (speedCheckbox?.checked) {
            speedGlobalValue.textContent = ` ${this.#padValue(value)}x`
        } else {
            speedTrackValue.textContent = ` ${this.#padValue(value)}x`
        }

        this.#video.playbackRate = value
        this.#video.currentSpeed = value 
        this.#video.preservesPitch = pitchPreserved
    }
}
