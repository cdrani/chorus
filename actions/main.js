import Icon from '../models/icon.js'
import Chorus from '../models/chorus.js'

import { createAlert } from '../components/alert.js'

export default class Main {
    #icon
    #snip
    #chorus

    constructor(snip) {
        this.#snip = snip
        this.#icon = new Icon()
        this.#chorus = new Chorus()

        this.init()
    }

    init() {
        this.#placeIcon()
        this.#setupAlert()
    }

    #placeIcon() {
        const root = this.#icon.createRootContainer()

        const interval = setInterval(() => {
            const iconListContainer = document.querySelector('[data-testid="now-playing-widget"]')

            if (!iconListContainer) return

            iconListContainer.insertAdjacentHTML('beforeend', root)
            this.#setIconListener()

            clearInterval(interval)
        }, 50)
    }

    #handleAlert({ e, target }) {
        e.stopPropagation()
        const container = target.parentElement
        container.style.display = 'none'
    }

    #setupAlert() {
        document.body.insertAdjacentHTML('beforeend', createAlert()) 

        const closeAlert = document.getElementById('chorus-alert-close-button')
        closeAlert?.addEventListener('click', (e) => this.#handleAlert({ e, target: closeAlert }))
    }

    get element() {
        return this.#mainElement
    }

    get #mainElement() {
        return document.getElementById('chorus-main')
    }

    #setIconListener() {
        const icon = document.getElementById('chorus-icon')
        icon?.addEventListener('click', () => { 
            this.#chorus.toggle()
            if (this.#chorus.isShowing) this.#snip.init()
        })
    }
}
