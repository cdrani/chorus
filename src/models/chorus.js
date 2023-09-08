import { createSnipControls } from '../components/snip/snip-controls.js'
import { createSpeedControls } from '../components/speed/speed-controls.js'
import { createSeekControls } from '../components/seek/seek-controls.js'

import { parseNodeString } from '../utils/parser.js'

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

        const snipControlsEl = parseNodeString(createSnipControls())
        const speedControlsEl = parseNodeString(createSpeedControls())
        const seekControlsEl = parseNodeString(createSeekControls())

        this.chorusControls.appendChild(snipControlsEl)
        this.chorusControls.appendChild(speedControlsEl)
        this.chorusControls.appendChild(seekControlsEl)
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
