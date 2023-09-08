import Chorus from '../models/chorus.js'
import Speed from '../models/speed/speed.js'

export default class ButtonListeners {
    #snip
    #speed
    #chorus
    #currentView = 'snip'

    constructor(snip) {
        this.#snip = snip
        this.#speed = new Speed(snip._store)
        this.#chorus = new Chorus()
    }

    init() {
        this.#snipViewToggle()
        this.#seekViewToggle()
        this.#speedViewToggle()
        this.#closeModalListener()
        this.#saveTrackListener()
        this.#saveSpeedListener()
        this.#shareTrackListener()
        this.#deleteTrackListener()
        this.#resetSpeedListener()
    }

    async #hide() {
        if (this.#currentView == 'speed') {
            this.#speed.clearCurrentSpeed()
            await this.#speed.reset()
        }

        this.#chorus.hide()
        this.#snip.isEditing = false
        this.#snipContainer.style.display = 'block'
        this.#seekContainer.style.display = 'none'
        this.#speedContainer.style.display = 'none'
    }

    get #snipContainer() {
        return document.getElementById('chorus-snip-controls')
    }

    get #speedContainer() {
        return document.getElementById('chorus-speed-controls')
    }

    get #seekContainer() {
        return document.getElementById('chorus-seek-controls')
    }

    #seekViewToggle() {
        const seekButton = document.getElementById('chorus-seek-button')

        seekButton?.addEventListener('click', () => {
            const showingSeekControls = this.#seekContainer?.style?.display == 'block'
            if (showingSeekControls) return

            this.#currentView = 'seek'
            this.#speedContainer.style.display = 'none'
            this.#snipContainer.style.display = 'none'
            this.#seekContainer.style.display = 'block'
        })
    }

    #snipViewToggle() {
        const snipButton = document.getElementById('chorus-snip-button')

        snipButton?.addEventListener('click', () => {
            const showingSnipControls = this.#snipContainer?.style?.display == 'block'
            if (showingSnipControls) return

            this.#currentView = 'snip'
            this.#speedContainer.style.display = 'none'
            this.#seekContainer.style.display = 'none'
            this.#snipContainer.style.display = 'block'
        })
    }

    #speedViewToggle() {
        const speedButton = document.getElementById('chorus-speed-button')
        speedButton?.addEventListener('click', async () => {
            const showingSpeedControls = this.#speedContainer?.style?.display == 'block'
            if (showingSpeedControls) return

            this.#currentView = 'speed'
            this.#snipContainer.style.display = 'none'
            this.#seekContainer.style.display = 'none'
            this.#speedContainer.style.display = 'block'
            await this.#speed.init()
        })
    }

    #closeModalListener() {
        const closeButton = document.getElementById('chorus-modal-close-button')
        closeButton?.addEventListener('click', async () =>  { 
            await this.#hide()
            this.#currentView = 'snip'
        })
    }

    #resetSpeedListener() {
        const resetButton = document.getElementById('chorus-speed-reset-button')
        resetButton?.addEventListener('click', async () => {
            await this.#speed.reset()
        })
    }

    #deleteTrackListener() {
        const deleteButton = document.getElementById('chorus-snip-remove-button')
        deleteButton?.addEventListener('click', async () => {
            await this.#snip.delete()
            this.#hide()
        }, { once: true })
    }

    #saveTrackListener() {
        const saveButton = document.getElementById('chorus-snip-save-button')
        saveButton?.addEventListener('click', async () => {
            await this.#snip.save()
            this.#hide()
        })
    }

    #saveSpeedListener() {
        const speedSaveButton = document.getElementById('chorus-speed-save-button')
        speedSaveButton?.addEventListener('click', async () => {
            await this.#speed.save()
            this.#hide()
        })
    }

    #handleShare = e => {
        e.stopPropagation()
        this.#snip.share()
        this.#hide()
    }

    #shareTrackListener() {
        const shareButton = document.getElementById('chorus-snip-share-button')
        shareButton?.removeEventListener('click', this.#handleShare)
        shareButton?.addEventListener('click', this.#handleShare)
    }
}
