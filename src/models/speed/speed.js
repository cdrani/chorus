import RangeSlider from '../range/range.js'

import { store } from '../../stores/data.js'
import { currentData } from '../../data/current.js'

import { spotifyVideo } from '../../actions/overload.js'

export default class Speed {
    #store
    #video
    #controls

    constructor() {
        this.#store = store
        this.#video = spotifyVideo.element
        this.#controls = new RangeSlider(this.#video)
    }

    async init() {
        const data = await currentData.getPlaybackValues()
        this.#controls.init(data)
    }

    clearCurrentSpeed() {
        this.#video.clearCurrentSpeed()
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
        const trackInfo = await currentData.readTrack()

        await this.#store.saveTrack({
            id: currentData.songId,
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
        const globalsInfo = await currentData.readGlobals()
        const trackInfo = await currentData.readTrack()

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

    async reset() {
        await this.init()
    }
}
