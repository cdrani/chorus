class Snip {
    constructor({ video, store }) {
        this._video = video
        this._store = store
        this._controls = new SnipControls(video)
    }

    init() {
        this._controls.init()
        this._controls.setInitialValues(this.read())
        this.toggleRemoveButton()
    }

    toggleRemoveButton() {
        const { isSnip } = this.read()

        const removeButton = document.getElementById('chorus-remove-button')
        removeButton.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    get defaultTrack() {
        return {
            id: this._video.id,
            value: {
                startTime: 0,
                isSnip: false,
                endTime: playback.duration(),
            },
        }
    }

    async save() {
        const { inputLeft, inputRight } = this._controls.slider.elements

        const response = await this._store.saveTrack({
            id: this._video.id,
            value: {
                isSnip: true,
                startTime: inputLeft.value,
                endTime: inputRight.value,
            },
        })

        this.setUpdateControls(response)
        this._highlightSnip(response?.isSnip)

        return response
    }

    read() {
        return this._store.getTrack(this.defaultTrack)
    }

    load() {
        this._video.volume = 0

        const response = this.read()
        if (response?.isSnip) {
            this.loadSnip(response)
        }

        this._video.volume = 1
        this.setUpdateControls(response)
        this._highlightSnip(response?.isSnip)
    }

    reset() {
        this._controls.setInitialValues()
    }

    async delete() {
        const response = await this._store.deleteTrack(this.defaultTrack)

        this.setUpdateControls(response)
        this._highlightSnip(response?.isSnip)

        return response
    }

    _highlightSnip(isSnip) {
        const svgElement = document.getElementById('chorus-highlight')
        const fill = Boolean(isSnip) ? '#1ed760' : 'currentColor'

        svgElement.style.stroke = fill
    }

    loadSnip(response) {
        this._video.pause()
        this._video.volume = 0

        const playPromise = this._video.play()
        if (playPromise === undefined) return

        playPromise
            .then(() => {
                this.setUpdateControls(response)
                this._video.volume = 1
            })
            .catch(e => console.error(e))
    }

    setUpdateControls(response) {
        const { startTime, endTime, isSnip } = response
        this._video.setAttributes({ isSnip, startTime, endTime })
        this._controls.updateControls(response)
    }
}
