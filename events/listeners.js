class ButtonListeners {
    constructor(snip) {
        this._snip = snip
    }

    listen() {
        this._closeListener()
        this._saveTrackListener()
        this._deleteTrackListener()
    }

    _hide() {
        const main = document.getElementById('chorus-main')
        main.style.display = 'none'
    }

    _closeListener() {
        const closeButton = document.getElementById('chorus-close-button')
        closeButton?.addEventListener('click', () => this._hide())
    }

    _deleteTrackListener() {
        const deleteButton = document.getElementById('chorus-remove-button')
        deleteButton?.addEventListener('click', async () => {
            await this._snip.delete()
            this._hide()
        })
    }

    _saveTrackListener() {
        const saveButton = document.getElementById('chorus-save-button')
        saveButton?.addEventListener('click', async () => {
            await this._snip.save()
            this._hide()
        })
    }
}

class SkipBackListener {
    constructor(snip) {
        this._snip = snip
    }

    listen() {
        const previousButton = document.querySelector('[data-testid="control-button-skip-back"]')

        previousButton?.addEventListener('click', () => {
            const currentTime = parseInt(this._snip._video.currentTime)
            const { startTime, isSnip } = this._snip.read()

            if (Boolean(isSnip) && Math.abs(currentTime - startTime) >= 3) {
                this._snip.load()
            }
        })
    }
}
