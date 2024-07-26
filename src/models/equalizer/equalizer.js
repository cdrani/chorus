import { EQ_PRESETS, EQ_FILTERS } from '../../lib/equalizer/presets'

export default class Equalizer {
    _filters

    constructor(video) {
        this._video = video
        this._filters = []
    }

    #setup() {
        this._audioContext = this._audioContext ?? new AudioContext({ latencyHint: 'playback' })
        this._source = this._source ?? this._audioContext.createMediaElementSource(this._video)
    }

    async setEQEffect(effect) {
        this.#setup()

        if (effect == 'none') return this.#disconnect()

        try {
            this.#applyEQFilters(effect)
        } catch (error) {
            console.error({ error })
        }
    }

    #createBiquadFilter({ setting, effect, index }) {
        const effectGain = EQ_PRESETS[effect][index]
        const filter = this._audioContext.createBiquadFilter()

        filter.type = setting.type
        filter.frequency.value = setting.freq || 0
        filter.gain.value = effectGain || 0
        filter.Q.value = 1

        return filter
    }

    #applyEQFilters(effect) {
        this.#disconnect()
        EQ_FILTERS.forEach((setting, index) => {
            const filter = this.#createBiquadFilter({ setting, index, effect })
            this._filters.push(filter)
        })

        // connect filters
        this._audioNode = this._source
        this._filters.forEach((filter) => {
            this._audioNode.connect(filter)
            this._audioNode = filter
        })

        this._audioNode.connect(this._audioContext.destination)
    }

    #disconnect() {
        if (!this._filters.length) return

        this._filters.forEach((filter) => {
            filter.disconnect()
        })

        this._filters = []

        this._source?.disconnect()
        this._source?.connect(this._audioContext.destination)
    }
}
