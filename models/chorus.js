import { createSnipControls } from '../components/snip/snip-controls.js'
import { createSpeedControls } from '../components/speed/speed-controls.js'

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
        const speedControls = createSpeedControls()

        this.chorusControls.insertAdjacentHTML('beforeend', snipControls)
        this.chorusControls.insertAdjacentHTML('beforeend', speedControls)
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
