class Slider {
    constructor(video) {
        this._video = video
    }

    init() {
        this._setUpEvents()
        this.setInitialValues()
    }

    _setUpEvents() {
        const { inputLeft, inputRight, thumbLeft, thumbRight } = this.elements

        inputLeft.oninput = () => this.setLeftValue()
        inputRight.oninput = () => this.setRightValue()

        inputLeft.addEventListener('mouseover', () => thumbLeft.classList.add('hover'))
        inputLeft.addEventListener('mouseout', () => thumbLeft.classList.remove('hover'))
        inputLeft.addEventListener('mousedown', () => thumbLeft.classList.add('active'))
        inputLeft.addEventListener('mouseup', () => thumbLeft.classList.remove('active'))

        inputRight.addEventListener('mouseover', () => thumbRight.classList.add('hover'))
        inputRight.addEventListener('mouseout', () => thumbRight.classList.remove('hover'))
        inputRight.addEventListener('mousedown', () => thumbRight.classList.add('active'))
        inputRight.addEventListener('mouseup', () => thumbRight.classList.remove('active'))
    }

    setInitialValues() {
        const { duration } = this._video

        this.updateSliderLeftHalf({ current: 0, duration })
        this.updateSliderRightHalf({ current: duration, duration })
    }

    get elements() {
        return {
            outputRight: document.getElementById('chorus-end'),
            outputLeft: document.getElementById('chorus-start'),
            inputLeft: document.getElementById('input-start'),
            inputRight: document.getElementById('input-end'),
            range: document.querySelector('.slider > .range'),
            thumbLeft: document.querySelector('.slider > .thumb.left'),
            thumbRight: document.querySelector('.slider > .thumb.right'),
        }
    }

    _setInputValues(duration) {
        if (!duration) return

        const { inputLeft, inputRight } = this.elements

        inputLeft.max = duration
        inputRight.max = duration
    }

    setLeftValue() {
        const { inputLeft } = this.elements

        const current = parseInt(inputLeft.value)
        const duration = parseInt(inputLeft.max)
        this.updateSliderLeftHalf({ current, duration })

        this._video.currentTime = inputLeft.value
    }

    setRightValue() {
        const { inputRight } = this.elements

        const duration = parseInt(inputRight.max)
        const current = parseInt(inputRight.value)

        this.updateSliderRightHalf({ duration, current })
    }

    updateSliderLeftHalf({ duration, current }) {
        const { inputLeft, inputRight, range, thumbLeft, outputLeft } = this.elements

        this._setInputValues(duration)

        inputLeft.value = Math.min(
            parseInt(current ?? inputLeft.value),
            parseInt(inputRight.value) - 1
        )

        const percent = ((inputLeft.value - inputLeft.min) / (inputLeft.max - inputLeft.min)) * 100

        thumbLeft.style.left = `${percent}%`
        range.style.left = `${percent}%`
        outputLeft.textContent = secondsToTime(inputLeft.value)
    }

    updateSliderRightHalf({ duration, current }) {
        const { inputLeft, inputRight, thumbRight, range, outputRight } = this.elements

        this._setInputValues(duration)

        inputRight.value = Math.max(
            parseInt(current ?? inputRight.value),
            parseInt(inputLeft.value)
        )

        const percent =
            ((inputRight.value - inputRight.min) / (inputRight.max - inputRight.min)) * 100

        thumbRight.style.right = 100 - percent + '%'
        range.style.right = 100 - percent + '%'
        outputRight.textContent = secondsToTime(inputRight.value)
    }
}
