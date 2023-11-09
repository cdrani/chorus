import { getParamsListForEffect } from '../../lib/reverb/presets.js'

export default class Reverb {
    constructor(video)  {
        this._video = video
    }

    async setup() {
        this._audioContext = this._audioContext ?? new AudioContext()
        this._source = this._source ?? this._audioContext.createMediaElementSource(this._video)
        this._gain = this._gain ?? this._audioContext.createGain()
        await this._audioContext.audioWorklet
          .addModule('chrome-extension://lcmijjhfgdfhlakhialnfdlcmmafhiig/lib/reverb/reverb.js')

        this._reverb = this._reverb ?? 
            new AudioWorkletNode(this._audioContext, 'UXFDReverb', { outputChannelCount: [2] })

        this._source.disconnect()

        this._source.connect(this._gain)
        this._gain.connect(this._reverb)
        this._reverb.connect(this._audioContext.destination)

    }

    disconnect() {
        this._source?.disconnect()
        this._source?.connect(this._audioContext.destination)
    }

    async applyReverbEffect(effect) {
        if (effect == 'none') return this.disconnect()

        try {
            await this.setup()
            this.#applyReverbEffectParams(effect)
        } catch (error) { console.error('EROROROROROROR: ', error)}
    }

    #applyReverbEffectParams(effect) {
        const paramsList = getParamsListForEffect(effect)
        paramsList.forEach(({ name, value }) => {
            this._reverb.parameters.get(name).linearRampToValueAtTime(value, this._audioContext.currentTime + 0.195)
        })
    }
}
