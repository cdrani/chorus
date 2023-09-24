import Listeners from './listeners.js'

export default class ActionListeners extends Listeners {
    constructor() {
        super()
    }

    init() {
        this.#saveSeekListener()
        this.#saveTrackListener()
        this.#saveSpeedListener()

        this.#shareTrackListener()
        this.#deleteTrackListener()
        this.#resetSpeedListener()
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
        shareButton?.removeEventListener('click', () => this.#handleShare())
        shareButton?.addEventListener('click', () => this.#handleShare())
    }
}
