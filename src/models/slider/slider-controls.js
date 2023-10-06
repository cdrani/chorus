import Slider from './slider.js'

import { playback } from '../../utils/playback.js'
import { secondsToTime } from '../../utils/time.js'

export default class SliderControls {
    constructor() {
        this._slider = new Slider()
    }

    init() {
        this._slider.init()
    }

    setInitialValues(track) {
        this._slider.setInitialValues(track)
        this.#setInitialStartAndEndValues(track)
    }

    get #labelElements() {
        return {
            labelEnd: document.getElementById('chorus-end'),
            labelStart: document.getElementById('chorus-start'),
        }
    }

    #setInitialStartAndEndValues(track) {
        const { labelStart, labelEnd } = this.#labelElements

        const { startTime, endTime } = track

        labelStart.textContent = secondsToTime(startTime ?? 0)
        labelEnd.textContent = secondsToTime(endTime ?? playback.duration())
    }

    get #isControlsOpen() {
        const controls = document.getElementById('chorus-snip-controls')
        if (!controls) return false

        return controls?.style?.display == 'block'
    }

    updateControls(track) {
        if (!this.#isControlsOpen) return

        const { startTime, endTime } = track

        const current = playback.current()
        const duration = playback.duration()

        this._slider.updateSliderLeftHalf(startTime ?? current)
        this._slider.updateSliderRightHalf(endTime ?? duration)
    }
}
