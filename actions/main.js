import Icon from '../models/icon.js'
import { createSnipControls } from '../components/snip-controls.js'

import { playback } from '../utils/playback.js'

export default class Main {
    #snip
    #icon
    #listener

    constructor({ snip, listener }) {
        this.#snip = snip
        this.#icon = new Icon()
        this.#listener = listener

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

    get #isBlock() {
        if (!this.#mainElement) return false

        return this.#mainElement.style.display === 'block'
    }

    get #hasControls() {
        const snipControls = document.getElementById('chorus-snip-controls')

        return !!snipControls
    }

    #createMainElement() {
        const div = document.createElement('div')
        div.id = 'chorus-main'

        const root = document.getElementById('chorus')
        root?.append(div)
    }

    #setIconListener() {
        const icon = document.getElementById('chorus-icon')
        icon?.addEventListener('click', () => this.#toggler())
    }

    #insertIntoDOM() {
        if (this.#hasControls) return
        if (this.#mainElement) return

        this.#createMainElement()

        const snipControls = createSnipControls({
            current: playback.current,
            duration: playback.duration,
        })

        this.#mainElement.insertAdjacentHTML('beforeend', snipControls)
    }

    #hide() {
        if (!this.#mainElement) return

        this.#mainElement.style.display = 'none'
    }

    #show() {
        this.#insertIntoDOM()
        this.#mainElement.style.display = 'block'

        this.#snip.init()
        this.#listener.listen()
    }

    #toggler() {
        this.#isBlock ? this.#hide() : this.#show()
    }
}
