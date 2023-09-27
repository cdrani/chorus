import Chorus from '../models/chorus.js'
import SeekIcons from '../models/seek/seek-icon.js'

import { songState } from '../data/song-state.js'

export default class NowPlayingObserver {
    constructor({ snip, video }) {
        this._snip = snip
        this._video = video
        this._observer = null
        this._chorus = new Chorus()
        this._seekIcons = new SeekIcons()

        this.observe()
    }

    observe() {
        const config = { subtree: true, childList: true, attributes: true }
        const target = document.querySelector('[data-testid="now-playing-widget"]')

        this._observer = new MutationObserver(this.#mutationHandler)
        this._observer.observe(target, config)
        this.#toggleSnipUI()
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
                const { isShared, isSkipped, startTime, endTime } = await songState()

                if (!isShared && location?.search) history.pushState(null, '', location.pathname)
                if (this._chorus.isShowing) this._snip.init()
                this._snip.updateView()
                await this._seekIcons.setSeekLabels()
                await this._video.activate() 
                
                if (isSkipped) {
                    document.querySelector('[data-testid="control-button-skip-forward"]')?.click()
                    this._video.currentTime = { source: 'chorus', value: endTime + 1 }
                } else {
                    this._video.element.currentTime = { source: 'chorus', value: startTime }
                }
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
        this._observer = null
        this.#toggleSnipUI()
    }
}
