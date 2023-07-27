import { createSnipControls } from "../components/snip-controls.js"

import { playback } from '../utils/playback.js'

export default class Chorus {
    get isShowing() {
        if (!this.mainElement) return false

        return this.mainElement.style.display == 'block'
    }

    get mainElement() {
        return document.getElementById('chorus-main')
    }

    #createMainElement() {
        const div = document.createElement('div')
        div.id = 'chorus-main'
        div.style.display = 'block'

        const root = document.getElementById('chorus')
        root?.append(div)
    }

    get #hasControls() {
        const snipControls = document.getElementById('chorus-snip-controls')

        return !!snipControls
    }

    toggle() {
        this.isShowing ? this.hide() : this.show()
    }

    #insertIntoDOM() {
        if (this.mainElement && this.#hasControls) return

        this.#createMainElement()

        const snipControls = createSnipControls({
            current: playback.current(),
            duration: playback.duration(),
        })

        this.mainElement.insertAdjacentHTML('beforeend', snipControls)
    }

    hide() {
        if (!this.mainElement) return

        this.mainElement.style.display = 'none'
    }

    show() {
        this.#insertIntoDOM()
        this.mainElement.style.display = 'block'
    }
}
