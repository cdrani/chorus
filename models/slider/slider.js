import { spotifyVideo } from '../../actions/overload.js'

import { playback } from '../../utils/playback.js'
import { secondsToTime } from '../../utils/time.js'
import { currentSongInfo } from '../../utils/song.js'

export default class Slider {
    #video
    #leftDebouncer
    #rightDebouncer
    #isCurrentlyPlaying = true

    constructor() {
        this.#video = spotifyVideo.element
    }

    init() {
        this.#setUpEvents()
    }

    #setUpEvents() {
        const { inputLeft, inputRight, thumbLeft, thumbRight } = this.#elements

        inputLeft.oninput = () => this.#setLeftValue()
        inputRight.oninput = () => this.#setRightValue()

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
        const { endDisplay } = this.#elements
        const duration = track?.duration ?? playback.duration()

        endDisplay.textContent = secondsToTime(duration)
        this.#setMaxMin(duration)

        this.updateSliderLeftHalf(startTime ?? 0)
        this.updateSliderRightHalf(endTime ?? duration)
    }

    #setMaxMin(duration) {
        const { inputLeft, inputRight } = this.#elements
        inputLeft.max = duration
        inputRight.max = duration
    }

    get #elements() {
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

    #setLeftValue() {
        if (this.#leftDebouncer) clearTimeout(this.#leftDebouncer)

        this.#leftDebouncer = setTimeout(() => {
            const { inputLeft } = this.#elements
            const currentValue = parseInt(inputLeft.value)

            this.updateSliderLeftHalf(currentValue)

            if (this.#isCurrentlyPlaying) this.#video.currentTime = inputLeft.value
        }, 50)
    }

    #setRightValue() {
        if (this.#rightDebouncer) clearTimeout(this.#rightDebouncer)

        this.#rightDebouncer = setTimeout(() => {
            const { inputRight } = this.#elements
            const currentValue = parseInt(inputRight.value)

            this.updateSliderRightHalf(currentValue)

            if (this.#isCurrentlyPlaying) this.#video.currentTime = inputRight.value
        }, 50)
    }

    updateSliderLeftHalf(currentValue) {
        const { inputLeft, inputRight, range, thumbLeft, outputLeft } = this.#elements

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
        const { inputLeft, inputRight, thumbRight, range, outputRight } = this.#elements

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
