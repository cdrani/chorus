import Listeners from './listeners.js'

export default class HeaderListeners extends Listeners {
    constructor(songTracker) {
        super(songTracker)

        this._setup = false
        this._viewInFocus = null
        this._VIEWS = ['snip', 'speed', 'effects', 'seek']
    }

    init() {
        if (this._setup) return

        this.#snipViewToggle()
        this.#seekViewToggle()
        this.#speedViewToggle()
        this.#effectsViewToggle()
        this.#closeModalListener()

        this._currentView = 'snip'
        this._setup = true
    }

    async hide() {
        if (this._viewInFocus == 'speed') {
            this._speed.clearCurrentSpeed()
            await this._speed.reset()
        }

        this._hide()
    }

    #seekViewToggle() {
        const seekButton = document.getElementById('chorus-seek-button')

        seekButton?.addEventListener('click', async () => {
            this._currentView = 'seek'
            await this._seek.init()
        })
    }

    set _currentView(selectedView) {
        this._viewInFocus = selectedView
        
        this._VIEWS.forEach(view => {
            const viewButton = document.getElementById(`chorus-${view}-button`)
            const viewInFocusContainer = document.getElementById(`chorus-${view}-controls`)
            if (!viewButton || !viewInFocusContainer) return

            viewButton.style.background = view == selectedView ? 'green' : '#535353'
            viewInFocusContainer.style.display = view == selectedView ? 'block' : 'none'
        })
    }

    #snipViewToggle() {
        const snipButton = document.getElementById('chorus-snip-button')
        snipButton?.addEventListener('click', () => { this._currentView = 'snip' })
    }

    #speedViewToggle() {
        const speedButton = document.getElementById('chorus-speed-button')
        speedButton?.addEventListener('click', async () => {
            this._currentView = 'speed'
            await this._speed.init()
        })
    }

    #effectsViewToggle() {
        const effectsButton = document.getElementById('chorus-effects-button')
        effectsButton?.addEventListener('click', async () => {
            this._currentView = 'effects'
            await this._reverb.init()
        })
    }

    #closeModalListener() {
        const closeButton = document.getElementById('chorus-modal-close-button')
        closeButton?.addEventListener('click', async () =>  { await this.hide() })
    }
}
