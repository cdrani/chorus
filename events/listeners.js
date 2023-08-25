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
        this.#snip.isEditing = false
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

    #handleShare = e => {
        e.stopPropagation()
        this.#snip.share()
        this.#hide()
    }

    #shareTrackListener() {
        const shareButton = document.getElementById('chorus-share-button')
        shareButton?.removeEventListener('click', this.#handleShare)
        shareButton?.addEventListener('click', this.#handleShare)
    }
}
