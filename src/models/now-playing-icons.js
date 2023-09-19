import Chorus from './chorus.js'
import { store } from '../stores/data.js'
import { currentData } from '../data/current.js'
import { createControls } from '../components/controls.js'
import { SETTINGS_ICON, NOW_PLAYING_SKIP_ICON, createIcon } from '../components/icons/icon.js'

import { currentSongInfo } from '../utils/song.js'
import { parseNodeString } from '../utils/parser.js'

export default class NowPlayingIcons {
    constructor(snip) {
        this.snip = snip
        this.chorus = new Chorus()

        this.init()
    }

    init() {
        this.#placeIcons()
    }

    // TODO: Icon should not be concerned with creating the main UI
    #createRootContainer() {
        return `
            <div id="chorus">
                ${this.#createSettingsIcon()}
                ${this.#createSkipIcon()}
                <div id="chorus-main" style="display: none">
                    ${createControls()}
                </div>
            </div>
        `
    }

    #placeIcons() {
        const root = this.#createRootContainer()

        const interval = setInterval(() => {
            const iconListContainer = document.querySelector('[data-testid="now-playing-widget"]')

            if (!iconListContainer) return

            const rootEl = parseNodeString(root)
            iconListContainer.appendChild(rootEl)

            this.#setIconListeners()
            clearInterval(interval)
        }, 50)
    }

    #createSettingsIcon() {
        return createIcon(SETTINGS_ICON)
    }

    #createSkipIcon()  {
        return createIcon(NOW_PLAYING_SKIP_ICON)
    }

    #setIconListeners() {
        const settingsIcon = document.getElementById('chorus-icon')
        settingsIcon?.addEventListener('click', () => { 
            this.chorus.toggle()
            if (this.chorus.isShowing) this.snip.init()
        })

        const skipIcon = document.getElementById('chorus-skip') 
        skipIcon.addEventListener('click', () => this.#handleSkipTrack())
    }

    async #handleSkipTrack() {
        const songInfo = await currentData.readTrack()
        if (!songInfo) return

        await store.saveTrack({
            id: currentSongInfo().id,
            value: { ...songInfo, isSkipped: !songInfo.isSkipped },
        })
    }
}
