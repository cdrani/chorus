class SliderControls {
    constructor(video) {
        this._video = video
        this._slider = new Slider(video)
        this._inputs = new SliderInputs(this._slider)
    }

    init() {
        this._slider.init()
        this._inputs.init()
    }

    get slider() {
        return this._slider
    }

    get inputs() {
        return this._inputs
    }

    setInitialValues() {
        const duration = playback.duration()

        this._slider.setInitialValues()
        this._inputs.setInitialValues(duration)
    }

    get isOpen() {
        return document.getElementById('chorus-snip-controls')?.style?.display === 'block'
    }

    updateControls(track) {
        if (!this.isOpen) return

        const { startTime, endTime } = track

        const current = playback.current()
        const duration = playback.duration()

        this._inputs.setStartValue(startTime ?? current)
        this._inputs.setEndValue(endTime ?? duration)
        this._slider.updateSliderLeftHalf({ current: startTime ?? current, duration })
        this._slider.updateSliderRightHalf({ duration, current: endTime ?? duration })
    }
}
