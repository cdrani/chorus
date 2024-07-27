export default class AudioManager {
    constructor(video) {
        this._video = video
        this._audioContext = new AudioContext({ latencyHint: 'playback' })
        this._source = this._audioContext.createMediaElementSource(video)
        this._destination = this._audioContext.destination
    }

    get source() {
        return this._source
    }

    get audioContext() {
        return this._audioContext
    }

    connectReverb({ gain, reverb }) {
        this._source.disconnect()
        this._source.connect(gain)
        gain.connect(reverb)
        reverb.connect(this._destination)
    }

    connectEqualizer(node) {
        node.connect(this._destination)
    }

    disconnect() {
        this._source?.disconnect()
        this._source?.connect(this._destination)
    }
}
