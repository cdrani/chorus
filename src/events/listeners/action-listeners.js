import Listeners from './listeners.js'

export default class ActionListeners extends Listeners {
    constructor(songTracker) {
        super(songTracker)
        this._setup = false
    }

    init() {
        if (this._setup) return

        this.#saveSeekListener()
        this.#saveTrackListener()
        this.#saveSpeedListener()

        this.#shareTrackListener()
        this.#deleteTrackListener()
        this.#resetSpeedListener()

        this.#saveReverbListener()
        this.#resetReverbListener()
        this._setup = true
    }

    #resetSpeedListener() {
        const resetButton = document.getElementById('chorus-speed-reset-button')
        resetButton?.addEventListener('click', async () => {
            await this._speed.reset()
        })
    }

    #deleteTrackListener() {
        const deleteButton = document.getElementById('chorus-snip-remove-button')
        deleteButton?.addEventListener('click', async () => {
            await this._snip.delete()
            this._hide()
        })
    }

    #saveTrackListener() {
        const saveButton = document.getElementById('chorus-snip-save-button')
        saveButton?.addEventListener('click', async () => {
            await this._snip.save()
            this._hide()
        })
    }

    #saveSpeedListener() {
        const speedSaveButton = document.getElementById('chorus-speed-save-button')
        speedSaveButton?.addEventListener('click', async () => {
            await this._speed.save()
            this._hide()
        })
    }

    #saveReverbListener() {
        const reverbSaveButton = document.getElementById('chorus-effects-save-button')
        reverbSaveButton?.addEventListener('click', async () => await this._reverb.saveSelection())
    }

    #resetReverbListener() {
        const reverbResetButton = document.getElementById('chorus-effects-reset-button')
        reverbResetButton?.addEventListener('click', async () => await this._reverb.clearReverb())
    }

    #saveSeekListener() {
        const seekSaveButton = document.getElementById('chorus-seek-save-button')
        seekSaveButton?.addEventListener('click', async () => {
            await this._seek.save()
            this._hide()
        })
    }

    #handleShare() {
        this._snip.share()
        this._hide()
    }

    #shareTrackListener() {
        const shareButton = document.getElementById('chorus-snip-share-button')
        shareButton?.addEventListener('click', () => this.#handleShare())
    }
}
