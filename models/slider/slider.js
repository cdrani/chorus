import { spotifyVideo } from '../../actions/overload.js'

import { playback } from '../../utils/playback.js'
import { secondsToTime } from '../../utils/time.js'
import { currentSongInfo } from '../../utils/song.js'

export default class Slider {
    #isCurrentlyPlaying = true

    constructor() {
        this._video = spotifyVideo.element
    }

    init() {
        this._setUpEvents()
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

    setInitialValues(track) {
        this.#isCurrentlyPlaying = !track?.id ? true : track.id == currentSongInfo().id

        const { endTime, startTime } = track
        const { endDisplay } = this.elements
        const duration = track?.duration ?? playback.duration()

        endDisplay.textContent = secondsToTime(duration)
        this.#setMaxMin(duration)

        this.updateSliderLeftHalf(startTime ?? 0)
        this.updateSliderRightHalf(endTime ?? duration)
    }

    #setMaxMin(duration) {
        const { inputLeft, inputRight } = this.elements
        inputLeft.max = duration
        inputRight.max = duration
    }

    get elements() {
        return {
            endDisplay: document.getElementById('end'),
            outputRight: document.getElementById('chorus-end'),
            outputLeft: document.getElementById('chorus-start'),
            inputLeft: document.getElementById('input-start'),
            inputRight: document.getElementById('input-end'),
            range: document.querySelector('.slider > .range'),
            thumbLeft: document.querySelector('.slider > .thumb.left'),
            thumbRight: document.querySelector('.slider > .thumb.right'),
        }
    }

    setLeftValue() {
        const { inputLeft } = this.elements
        const currentValue = parseInt(inputLeft.value)

        this.updateSliderLeftHalf(currentValue)

        if (this.#isCurrentlyPlaying) this._video.currentTime = inputLeft.value
    }

    setRightValue() {
        const { inputRight } = this.elements
        const currentValue = parseInt(inputRight.value)

        this.updateSliderRightHalf(currentValue)

        // FIXME: currently causes next song to play instead
        // if (this.#isCurrentlyPlaying) {
        //     if (inputRight.value == inputRight.max) return

        //     this._video.currentTime = inputRight.value
        // }
    }

    updateSliderLeftHalf(currentValue) {
        const { inputLeft, inputRight, range, thumbLeft, outputLeft } = this.elements

        inputLeft.value = Math.min(
            parseInt(currentValue ?? inputLeft.value),
            parseInt(inputRight.value) - 1
        )

        const percent = ((inputLeft.value - inputLeft.min) / (inputLeft.max - inputLeft.min)) * 100

        thumbLeft.style.left = `${percent}%`
        range.style.left = `${percent}%`
        outputLeft.textContent = secondsToTime(inputLeft.value)
    }

    updateSliderRightHalf(currentValue) {
        const { inputLeft, inputRight, thumbRight, range, outputRight } = this.elements

        inputRight.value = Math.max(
            parseInt(currentValue ?? inputRight.value),
            parseInt(inputLeft.value)
        )

        const percent =
            ((inputRight.value - inputRight.min) / (inputRight.max - inputRight.min)) * 100

        thumbRight.style.right = `${100 - percent}%`
        range.style.right = `${100 - percent}%`
        outputRight.textContent = secondsToTime(inputRight.value)
    }
}
