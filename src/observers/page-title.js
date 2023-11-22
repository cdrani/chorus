import { currentData } from '../data/current.js'
import { lyricsSnip } from '../models/snip/lyrics-snip.js'

export default class PageTitleObserver {
    constructor() {
        this._observer = null
        this._lyricsSnip = lyricsSnip
    }

    observe() {
        this._observer = new MutationObserver(this.#handleMutation)
        this._observer.observe(document.querySelector('title'), { subtree: true, childList: true })
    }

    #handleMutation = async mutations => {
        for (const mutation of mutations) {
            const onLyricsPage = mutation.target.baseURI.endsWith('/lyrics')
            let isSnip = false
            if (onLyricsPage) {
                isSnip = await currentData.readTrack().isSnip
            }
            this._lyricsSnip.toggleUI(isSnip)
        }
    }

    disconnect() {
        this._observer = null
    }
}
