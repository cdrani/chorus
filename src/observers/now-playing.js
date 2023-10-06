import SeekIcons from '../models/seek/seek-icon.js'

export default class NowPlayingObserver {
    constructor({ snip, chorus, songTracker }) {
        this._snip = snip
        this._observer = null
        this._songTracker = songTracker

        this._chorus = chorus
        this._seekIcons = new SeekIcons()

        this.observe()
    }

    async observe() {
        const config = { subtree: true, childList: true, attributes: true }
        const target = document.querySelector('[data-testid="now-playing-widget"]')

        this._observer = new MutationObserver(this.#mutationHandler)
        this._observer.observe(target, config)
        this.#toggleSnipUI()
        this._seekIcons.init()
        await this._songTracker.init()
    }

    #isAnchor(mutation) {
        return (
            mutation.type === 'attributes' &&
            mutation.target.localName == 'a' &&
            mutation.attributeName === 'href'
        )
    }

    #mutationHandler = async mutationsList => {
        for (const mutation of mutationsList) {
            if (this.#isAnchor(mutation)) {
                if (this._chorus.isShowing) this._snip.init()
                await this._songTracker.songChange() 
                this._snip.updateView()
                await this._seekIcons.setSeekLabels()
            }
        }
    }

    #toggleSnipUI() {
        const snipUI = document.getElementById('chorus')
        if (!snipUI) return

        snipUI.style.display = this._observer ? 'flex' : 'none'
        const chorusMain = document.getElementById('chorus-main')
        if (!chorusMain) return

        chorusMain.style.display = 'none'
    }

    disconnect() {
        this._observer?.disconnect()
        this._seekIcons.removeIcons()
        this._songTracker.clearListeners()
        this._observer = null
        this.#toggleSnipUI()
    }
}
