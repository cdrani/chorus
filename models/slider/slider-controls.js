class SliderControls {
    constructor(video) {
        this._video = video
        this._slider = new Slider(video)
        this._inputs = new SliderInputs(this._slider)
    }

    init() {
        this._slider.init()
    }

    get slider() {
        return this._slider
    }

    get inputs() {
        return this._inputs
    }

    setInitialValues(track) {
        this._slider.setInitialValues(track)
        this._inputs.setInitialValues(track)
    }

    get isOpen() {
        return document.getElementById('chorus-snip-controls')?.style?.display == 'block'
    }

    updateControls(track) {
        if (!this.isOpen) return

        const { startTime, endTime } = track

        const current = playback.current()
        const duration = playback.duration()

        this._slider.updateSliderLeftHalf(startTime ?? current)
        this._slider.updateSliderRightHalf(endTime ?? duration)
    }
}
