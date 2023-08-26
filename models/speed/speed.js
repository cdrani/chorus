import RangeSlider from '../range/range.js'
import { spotifyVideo } from '../../actions/overload.js'
import { currentData } from '../../data/current.js'

export default class Speed {
    #store
    #controls
    #video = spotifyVideo.element

    constructor(store) {
        this.#store = store
        this.#controls = new RangeSlider(this.#video)
    }

    async init() {
        const data = await currentData.getPlaybackValues()
        this.#controls.init(data)
    }

    clearCurrentSpeed() {
        this.#video.clearCurrentSpeed()
    }

    get #trackDefaults() {
        return {
            startTime: 0,
            isSnip: false,
            isSkipped: false,
            endTime: this.#video.duration,
        }
    }

    get #inputValues() {
        const { input, speedCheckbox, pitchCheckbox } = this.#controls.elements

        return  {
            playbackRate: input.value,
            preservesPitch: pitchCheckbox?.checked,
            settingGlobalSpeed: speedCheckbox?.checked,
        }
    }

    async save() {
        const { playbackRate, settingGlobalSpeed, preservesPitch } = this.#inputValues
        this.#video.currentSpeed = playbackRate

        if (settingGlobalSpeed) {
            await this.saveGlobalSpeed({ playbackRate, preservesPitch })
            return
        }

        await this.saveTrackSpeed({ playbackRate, preservesPitch })
    }

    async saveTrackSpeed({ playbackRate, preservesPitch }) {
        const trackInfo = await this.readTrack()

        await this.#store.saveTrack({
            id: this.#songId,
            value: {
                ...trackInfo,
                playbackRate,
                preservesPitch,
            },
        })

        this.#video.playbackRate = playbackRate
        this.#video.preservesPitch = preservesPitch
    }

    async saveGlobalSpeed({ playbackRate, preservesPitch }) {
        const globalsInfo = await this.readGlobals()
        const trackInfo = await this.readTrack()

        await this.#store.saveTrack({
            id: 'globals',
            value: {
                ...globalsInfo,
                playbackRate,
                preservesPitch,
            }
        })

        if (!trackInfo?.playbackRate) {
            this.#video.playbackRate = playbackRate
            this.#video.preservesPitch = preservesPitch
        }
    }

    get #songId() {
        const title = document.getElementById('track-title')?.textContent
        const artists = document.getElementById('track-artists')?.textContent
        return `${title} by ${artists}`
    }

    async readTrack() {
        const track = await this.#store.getTrack({
            id: this.#songId,
            value: this.#trackDefaults
        })

        return track
    }

    async readGlobals() {
        const globals = await this.#store.getTrack({
            id: 'globals',
            value: {
                playbackRate: 1,
                preservesPitch: true
            }
        })

        return globals
    }

    async reset() {
        await this.init()
    }
}
