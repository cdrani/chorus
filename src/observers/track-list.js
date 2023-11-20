import { lyricsSnip } from '../models/snip/lyrics-snip.js'

export default class TrackListObserver {
    constructor(trackList) {
        this._observer = null
        this._isHidden = true
        this._trackList = trackList
        this._lyricsSnip = lyricsSnip
    }

    observe() {
        this.#showUI()
        this._trackList.setTrackListClickEvent()

        const target = document.querySelector('main')
        this._observer = new MutationObserver(this.#mutationHandler)
        this._observer.observe(target, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-label'] })
    }

    #isQueueView(mutation) {
        if (mutation.target.localName !== 'main') return false
        if (!mutation.addedNodes.length) return false

        const addedNode = Array.from(mutation.addedNodes)?.at(0)
        if (addedNode.localName != 'section') return false
        
        return true
    }

    #isMainView(mutation) {
        if (mutation.target.localName !== 'div') return false
        if (!mutation.addedNodes.length) return false

        const addedNode = Array.from(mutation.addedNodes)?.at(0)
        if (addedNode.localName != 'div') return false

        const classList = Array.from(mutation.target.classList)
        if (!classList.includes('main-view-container__mh-footer-container')) return false

        return true
    }

    #isMoreLoaded(mutation) {
        const { target } = mutation
        return target?.role == 'presentation' &&
            mutation.addedNodes.length >= 1
    }

    #isLyricsMainView(mutation) {
        return mutation.target.localName == 'main' && 
                mutation.type == 'attributes' || mutation?.attributeName == 'aria-label'
    }

    #isOnLyricsView(mutation) {
        if (mutation.target.ariaLabel !== 'Spotify') return false
        if (!mutation.target.baseURI.endsWith('/lyrics')) return false

        return true
    }

    #mutationHandler = (mutationsList) => {
        for (const mutation of mutationsList) {
            const trackListChanged = this.#isQueueView(mutation) || this.#isMainView(mutation) || this.#isMoreLoaded(mutation)
            if (trackListChanged) {
                if (this.#isMainView(mutation)) this._trackList.setTrackListClickEvent()
                this._isHidden ? this._trackList.removeBlocking() : this._trackList.setUpBlocking()         
            }

            if (this.#isLyricsMainView(mutation)) {
                const onLyricsPage = this.#isOnLyricsView(mutation)
                this._lyricsSnip.toggleUI(onLyricsPage)
            }
        }
    }

    #hideUI() {
        this._isHidden = true
        this._trackList.removeBlocking()
    }

    #showUI() {
        this._isHidden = false
        this._trackList.setUpBlocking()
    }

    disconnect() {
        this.#hideUI()

        this._observer?.disconnect()
        this._observer = null
    }
}
