class SnipControls extends VideoElement {
    constructor(video) {
        super(video)
        this._controls = new SliderControls(video)
    }

    init() {
        this._controls.init()
    }

    get slider() {
        return this._controls.slider
    }

    setInitialValues() {
        this._controls.setInitialValues()
    }

    updateControls(track) {
        this._controls.updateControls(track)
    }
}
