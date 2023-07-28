import Chorus from '../models/chorus.js'

export default class ButtonListeners {
    #snip
    #chorus

    constructor(snip) {
        this.#snip = snip
        this.#chorus = new Chorus()
    }

    init() {
        this.#closeListener()
        this.#saveTrackListener()
        this.#deleteTrackListener()
    }

    #hide() {
        this.#chorus.hide()
    }

    #closeListener() {
        const closeButton = document.getElementById('chorus-close-button')
        closeButton?.addEventListener('click', () => this.#hide())
    }

    #deleteTrackListener() {
        const deleteButton = document.getElementById('chorus-remove-button')
        deleteButton?.addEventListener('click', async () => {
            await this.#snip.delete()
            this.#hide()
        })
    }

    #saveTrackListener() {
        const saveButton = document.getElementById('chorus-save-button')
        saveButton?.addEventListener('click', async () => {
            await this.#snip.save()
            this.#hide()
        })
    }
}
