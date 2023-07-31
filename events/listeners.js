import Chorus from '../models/chorus.js'

export default class ButtonListeners {
    #snip
    #chorus

    constructor(snip) {
        this.#snip = snip
        this.#chorus = new Chorus()
    }

    init() {
        this.#closeModalListener()
        this.#saveTrackListener()
        this.#shareTrackListener()
        this.#deleteTrackListener()
    }

    #hide() {
        this.#chorus.hide()
    }

    #closeModalListener() {
        const closeButton = document.getElementById('chorus-modal-close-button')
        closeButton?.addEventListener('click', () => this.#hide(), { once: true })
    }

    #deleteTrackListener() {
        const deleteButton = document.getElementById('chorus-remove-button')
        deleteButton?.addEventListener('click', async () => {
            await this.#snip.delete()
            this.#hide()
        }, { once: true })
    }

    #saveTrackListener() {
        const saveButton = document.getElementById('chorus-save-button')
        saveButton?.addEventListener('click', async () => {
            await this.#snip.save()
            this.#hide()
        }, { once: true })
    }

    #shareTrackListener() {
        const shareButton = document.getElementById('chorus-share-button')
        shareButton?.addEventListener('click', () => {
            this.#snip.share()
            this.#hide()
        }, { once: true })
    }
}
