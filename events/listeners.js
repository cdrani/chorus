export default class ButtonListeners {
    #snip

    constructor(snip) {
        this.#snip = snip
    }

    init() {
        this.#closeListener()
        this.#saveTrackListener()
        this.#deleteTrackListener()
    }

    #hide() {
        const main = document.getElementById('chorus-main')
        main.style.display = 'none'
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
