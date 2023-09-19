import Chorus from '../models/chorus.js'
import SeekIcons from '../models/seek/seek-icon.js'

export default class NowPlayingObserver {
    #snip
    #video
    #chorus
    #observer
    #seekIcons

    constructor({ snip, video }) {
        this.#snip = snip
        this.#video = video
        this.#chorus = new Chorus()
        this.#seekIcons = new SeekIcons()

        this.observe()
    }

    observe() {
        const target = document.querySelector('[data-testid="now-playing-widget"]')
        const config = { subtree: true, childList: true, attributes: true }

        this.#observer = new MutationObserver(this.#handler)
        this.#observer.observe(target, config)
        this.#toggleSnipUI()
    }

    #isAnchor(mutation) {
        return (
            mutation.type === 'attributes' &&
            mutation.target.localName == 'a' &&
            mutation.attributeName === 'href'
        )
    }

    #handler = async mutationsList => {
        for (const mutation of mutationsList) {
            if (this.#isAnchor(mutation)) {
                if (this.#chorus.isShowing) this.#snip.init()

                this.#snip.updateView()
                await this.#seekIcons.setSeekLabels()
                await this.#video.activate() 
            }
        }
    }

    #toggleSnipUI() {
        const snipUI = document.getElementById('chorus')
        if (!snipUI) return

        snipUI.style.display = this.#observer ? 'flex' : 'none'

        const chorusMain = document.getElementById('chorus-main')
        if (!chorusMain) return

        chorusMain.style.display = 'none'
    }

    disconnect() {
        this.#observer?.disconnect()
        this.#observer = null
        this.#toggleSnipUI()
    }
}
