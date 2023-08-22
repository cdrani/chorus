import { createSnipControls } from "../components/snip-controls.js"

export default class Chorus {
    get isShowing() {
        if (!this.mainElement) return false

        return this.mainElement.style.display == 'block'
    }

    get mainElement() {
        return document.getElementById('chorus-main')
    }

    get chorusControls() {
        return document.getElementById('chorus-controls')
    }

    toggle() {
        this.isShowing ? this.hide() : this.show()
    }

    get #hasSnipControls() {
        return !!document.getElementById('chorus-snip-controls')
    }

    #insertIntoDOM() {
        if (this.#hasSnipControls) return

        const snipControls = createSnipControls()
        this.chorusControls.insertAdjacentHTML('beforeend', snipControls)
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
