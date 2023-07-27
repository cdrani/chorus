import Icon from '../models/icon.js'
import Chorus from '../models/chorus.js'

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
