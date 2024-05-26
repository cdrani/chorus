import { roomPresets, convolverPresets, getParamsListForEffect } from '../../lib/reverb/presets.js'

export default class Reverb {
    constructor(video) {
        this._video = video
    }

    #isDigital(effect) {
        return roomPresets.includes(effect)
    }

    isAPreset(effect) {
        return [...roomPresets, ...convolverPresets].includes(effect)
    }

    async setReverbEffect(effect) {
        this.#setup()
        if (effect == 'none') return this.#disconnect()

        const isDigital = this.#isDigital(effect)
        await (isDigital ? this.#createDigitalReverb(effect) : this.#createImpulseReverb(effect))
        if (!isDigital) return

        this.#connect()
        this.#applyReverbEffect(effect)
    }

    #setup() {
        this._audioContext = this._audioContext ?? new AudioContext({ latencyHint: 'playback' })
        this._source = this._source ?? this._audioContext.createMediaElementSource(this._video)
        this._gain = this._gain ?? this._audioContext.createGain()
    }

    #connect() {
        this._source.disconnect()
        this._source.connect(this._gain)
        this._gain.connect(this._reverb)
        this._reverb.connect(this._audioContext.destination)
    }

    async #createDigitalReverb() {
        const modulePath = sessionStorage.getItem('reverbPath')
        await this._audioContext.audioWorklet.addModule(modulePath)
        this._reverb =
            this._reverb ??
            new AudioWorkletNode(this._audioContext, 'DattorroReverb', {
                channelCountMode: 'explicit',
                channelCount: 1,
                outputChannelCount: [2]
            })
    }

    async #createImpulseReverb(effect) {
        this._convolverNode = this._convolverNode ?? this._audioContext.createConvolver()
        const soundsDir = sessionStorage.getItem('soundsDir')

        const response = await fetch(`${soundsDir}${effect}.wav`)
        const arraybuffer = await response.arrayBuffer()
        this._convolverNode.buffer = await this._audioContext.decodeAudioData(arraybuffer)

        this._source.connect(this._convolverNode)
        this._convolverNode.connect(this._gain)
        this._gain.connect(this._audioContext.destination)
    }

    #disconnect() {
        this._source?.disconnect()
        this._source?.connect(this._audioContext.destination)
    }

    async #applyReverbEffect(effect) {
        if (effect == 'none') return this.#disconnect()

        try {
            this.#applyReverbEffectParams(effect)
        } catch (error) {
            console.error({ error })
        }
    }

    #applyReverbEffectParams(effect) {
        const paramsList = getParamsListForEffect(effect)
        paramsList.forEach(({ name, value }) => {
            this._reverb.parameters
                .get(name)
                .linearRampToValueAtTime(value, this._audioContext.currentTime + 0.195)
        })
    }
}
