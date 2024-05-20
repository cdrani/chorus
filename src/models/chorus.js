import { createSnipControls } from '../components/snip/snip-controls.js'
import { createSpeedControls } from '../components/speed/speed-controls.js'
import { createSeekControls } from '../components/seek/seek-controls.js'
import { createEffectsControls } from '../components/effects/effects-controls.js'

import HeaderListeners from '../events/listeners/header-listeners.js'
import ActionListeners from '../events/listeners/action-listeners.js'

import { parseNodeString } from '../utils/parser.js'
import { spotifyVideo } from '../actions/overload.js'

export default class Chorus {
    constructor(songTracker) {
        this._songTracker = songTracker
        this._video = spotifyVideo.element
    }

    init() {
        this.headerListeners = new HeaderListeners(this._songTracker)
        this.actionListeners = new ActionListeners(this._songTracker)
    }

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
        const effectsControlsEl = parseNodeString(createEffectsControls())

        this.chorusControls.appendChild(snipControlsEl)
        this.chorusControls.appendChild(speedControlsEl)
        this.chorusControls.appendChild(effectsControlsEl)
        this.chorusControls.appendChild(seekControlsEl)
    }

    async hide() {
        if (!this.mainElement) return

        await this.headerListeners.hide()
        this.mainElement.style.display = 'none'
        this._video.resetTempTimes()
    }

    show() {
        this.#insertIntoDOM()
        this.mainElement.style.display = 'block'

        this.headerListeners.init()
        this.actionListeners.init()
    }
}
