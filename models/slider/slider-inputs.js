class SliderInputs {
    constructor(slider) {
        this._slider = slider
    }

    get elements() {
        return {
            inputEnd: document.getElementById('chorus-end'),
            inputStart: document.getElementById('chorus-start'),
        }
    }

    setInitialValues() {
        const duration = playback.duration()
        const { inputStart, inputEnd } = this.elements

        inputStart.textContent = '0:00'
        inputEnd.textContent = secondsToTime(duration)
    }

    setStartValue(value) {
        const { inputStart } = this.elements
        inputStart.textContent = secondsToTime(value)
    }

    setEndValue(value) {
        const { inputEnd } = this.elements
        inputEnd.textContent = secondsToTime(value)
    }
}
