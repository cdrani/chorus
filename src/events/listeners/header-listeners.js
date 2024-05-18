import Listeners from './listeners.js'
import { spotifyVideo } from '../../actions/overload.js'

export default class HeaderListeners extends Listeners {
    constructor(songTracker) {
        super(songTracker)

        this._setup = false
        this._viewInFocus = null
        this._video = spotifyVideo.element
        this._VIEWS = ['snip', 'speed', 'fx', 'seek']
    }

    init() {
        if (this._setup) return

        this.#snipViewToggle()
        this.#seekViewToggle()
        this.#speedViewToggle()
        this.#effectsViewToggle()
        this.#closeModalListener()

        this.currentView = 'snip'
        this._setup = true
    }

    async hide() {
        if (this._viewInFocus == 'speed') this._speed.clearCurrentSpeed()
        this._hide()
    }

    #seekViewToggle() {
        const seekButton = document.getElementById('chorus-seek-button')
        seekButton?.addEventListener('click', async () => {
            this.currentView = 'seek'
            await this._seek.init()
        })
    }

    set currentView(selectedView = 'snip') {
        this._viewInFocus = selectedView
        if (selectedView != 'snip') this._video.resetTempTimes()

        this._VIEWS.forEach((view) => {
            const viewButton = document.getElementById(`chorus-${view}-button`)
            const viewInFocusContainer = document.getElementById(`chorus-${view}-controls`)
            if (!viewButton || !viewInFocusContainer) return

            viewButton.style.background = view == selectedView ? 'green' : '#535353'
            viewInFocusContainer.style.display = view == selectedView ? 'block' : 'none'
        })
    }

    #snipViewToggle() {
        const snipButton = document.getElementById('chorus-snip-button')
        snipButton?.addEventListener('click', async () => {
            this.currentView = 'snip'
            await this._snip.init()
        })
    }

    #speedViewToggle() {
        const speedButton = document.getElementById('chorus-speed-button')
        speedButton?.addEventListener('click', async () => {
            this.currentView = 'speed'
            await this._speed.init()
        })
    }

    #effectsViewToggle() {
        const effectsButton = document.getElementById('chorus-fx-button')
        effectsButton?.addEventListener('click', () => {
            this.currentView = 'fx'
            this._reverb.init()
        })
    }

    #closeModalListener() {
        const closeButton = document.getElementById('chorus-modal-close-button')
        closeButton?.addEventListener('click', async () => {
            await this.hide()
        })
    }
}
