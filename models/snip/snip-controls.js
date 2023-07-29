import SliderControls from '../slider/slider-controls.js'

export default class SnipControls {
    constructor() {
        this._controls = new SliderControls()
    }

    init() {
        this._controls.init()
    }

    get slider() {
        return  this._controls.slider
    }

    setInitialValues(track) {
        this._controls.setInitialValues(track)
    }

    updateControls(track) {
        this._controls.updateControls(track)
    }
}
