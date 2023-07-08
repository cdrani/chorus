class SnipControls {
    constructor(video) {
        this._controls = new SliderControls(video)
    }

    init() {
        this._controls.init()
    }

    get slider() {
        return this._controls.slider
    }

    setInitialValues(track) {
        this._controls.setInitialValues(track)
    }

    updateControls(track) {
        this._controls.updateControls(track)
    }
}
