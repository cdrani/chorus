import { playback } from '../../utils/playback.js'
import { secondsToTime } from '../../utils/time.js'

export default class SliderInputs {
    constructor(slider) {
        this._slider = slider
    }

    get elements() {
        return {
            inputEnd: document.getElementById('chorus-end'),
            inputStart: document.getElementById('chorus-start'),
        }
    }

    setInitialValues(track) {
        const duration = playback.duration
        const { inputStart, inputEnd } = this.elements

        const { startTime, endTime } = track

        inputStart.textContent = secondsToTime(startTime ?? 0)
        inputEnd.textContent = secondsToTime(endTime ?? duration)
    }
}
