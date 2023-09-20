import Listeners from './listeners.js'

export default class HeaderListeners extends Listeners {
    constructor() {
        super()
        this.viewInFocus = null
        this.VIEWS = ['snip', 'speed', 'seek']
    }

    init() {
        this.#snipViewToggle()
        this.#seekViewToggle()
        this.#speedViewToggle()
        this.#closeModalListener()

        this.currentView = 'snip'
    }

    async hide() {
        if (this.viewInFocus == 'speed') {
            this._speed.clearCurrentSpeed()
            await this._speed.reset()
        }

        this.currentView = 'snip'
        this._hide()
    }

    #seekViewToggle() {
        const seekButton = document.getElementById('chorus-seek-button')

        seekButton?.addEventListener('click', async () => {
            this.currentView = 'seek'
            await this._seek.init()
        })
    }

    set currentView(selectedView) {
        this.viewInFocus = selectedView
        
        this.VIEWS.forEach(view => {
            const viewButton = document.getElementById(`chorus-${view}-button`)
            const viewInFocusContainer = document.getElementById(`chorus-${view}-controls`)
            if (!viewButton || !viewInFocusContainer) return

            viewButton.style.background = view == selectedView ? 'green' : '#535353'
            viewInFocusContainer.style.display = view == selectedView ? 'block' : 'none'
        })
    }

    #snipViewToggle() {
        const snipButton = document.getElementById('chorus-snip-button')
        snipButton?.addEventListener('click', () => { this.currentView = 'snip' })
    }

    #speedViewToggle() {
        const speedButton = document.getElementById('chorus-speed-button')
        speedButton?.addEventListener('click', async () => {
            this.currentView = 'speed'
            await this._speed.init()
        })
    }

    #closeModalListener() {
        const closeButton = document.getElementById('chorus-modal-close-button')
        closeButton?.addEventListener('click', async () =>  { 
            await this.hide()
        })
    }
}
