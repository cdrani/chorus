class Snip {
    #video
    #store
    #controls

    constructor({ video, store }) {
        this.#video = video
        this.#store = store
        this.#controls = new SnipControls(video)
    }

    init() {
        this.#controls.init()
        this.#controls.setInitialValues(this.read())
    }

    read() {
        return this.#store.getTrack(this.#defaultTrack)
    }

    get video() {
        return this.#video
    }

    get #defaultTrack() {
        return {
            id: this.#video.id,
            value: {
                startTime: 0,
                isSnip: false,
                isSkipped: false,
                endTime: playback.duration(),
            },
        }
    }

    async save() {
        const { inputLeft, inputRight } = this.#controls.slider.elements

        await this.#store.saveTrack({
            id: this.#video.id,
            value: {
                isSnip: true,
                startTime: inputLeft.value,
                endTime: inputRight.value,
                isSkipped: inputRight.value == 0,
            },
        })

        this.updateView()
    }

    reset() {
        this.#controls.setInitialValues()
    }

    async delete() {
        await this.#store.deleteTrack(this.#defaultTrack)
        this.updateView()
    }

    updateView() {
        const response = this.read()
        this.#setUpdateControls(response)
        this.#highlightSnip(response?.isSnip)
        this.#toggleRemoveButton(response?.isSnip)
    }

    #toggleRemoveButton(isSnip) {
        const removeButton = document.getElementById('chorus-remove-button')

        if (!removeButton) return
        removeButton.style.visibility = isSnip ? 'visible' : 'hidden'
    }

    #highlightSnip(isSnip) {
        const svgElement = document.getElementById('chorus-highlight')
        const fill = Boolean(isSnip) ? '#1ed760' : 'currentColor'

        svgElement.style.stroke = fill
    }

    #setUpdateControls(response) {
        const { startTime, endTime, isSnip } = response
        this.#video.setAttributes({ isSnip, startTime, endTime })
        this.#controls.updateControls(response)
    }
}
