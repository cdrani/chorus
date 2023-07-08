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

    _validInput(value) {
        // Regular expression to match input value in the format hh:mm:ss, mm:ss, or ss
        const timeFormatRegex = /^((\d{1,2}:)?\d{1,2})|(\d{1,2}:\d{1,2})|(\d{1,2}:\d{1,2}:\d{1,2})$/

        return timeFormatRegex.test(value)
    }

    _validateAndFormat({ target, value }) {
        const trimmedValue = value.trim()

        if (!this._validInput(trimmedValue)) return

        target.value = trimmedValue
        const isStart = target.name === 'chorus-start'

        isStart
            ? this._slider.updateSliderLeftHalf({
                  current: timeToSeconds(trimmedValue),
              })
            : this._slider.updateSliderRightHalf({
                  current: timeToSeconds(trimmedValue),
              })
    }

    _setValue(e) {
        if (e.key !== 'Enter') return

        clearTimeout(this._timer)

        const { target } = e
        this._validateAndFormat({ target, value: target.value })
    }

    setStartValue(value) {
        const { inputStart } = this.elements
        inputStart.placeholder = secondsToTime(value)
    }

    setEndValue(value) {
        const { inputEnd } = this.elements
        inputEnd.placeholder = secondsToTime(value)
    }
}
