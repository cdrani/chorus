import SkipIcon from './skip-icon.js'
import SnipIcon from './snip-icon.js'

import Chorus from './chorus.js'
import TrackSnip from "./snip/track-snip.js"

import { trackSongInfo } from '../utils/song.js'

export default class TrackList {
    #icons
    #chorus
    #snipIcon
    #skipIcon
    #trackSnip
    #previousRowNum = null
    #visibleEvents = ['mouseenter']
    #events = ['mouseenter', 'mouseleave']

    constructor(store) {
        this.#chorus = new Chorus()
        this.#skipIcon = new SkipIcon(store)
        this.#snipIcon = new SnipIcon(store)
        this.#trackSnip = new TrackSnip(store)
        
        this.#icons = [this.#skipIcon, this.#snipIcon]
    }

    get #trackRows() {
        const trackRows = document.querySelectorAll('[data-testid="tracklist-row"]')
        return trackRows?.length > 0 ? Array.from(trackRows) : undefined
    }

    setUpBlocking() {
        if (!this.#trackRows?.length) return

        this.#toggleBlockDisplay(false)
        this.#setRowEvents()
    }

    removeBlocking() {
        if (!this.#trackRows?.length) return

        this.#toggleBlockDisplay(true)
    }

    #toggleBlockDisplay(hide) {
        const blockIcons = this.#trackRows.map(row => (
            Array.from(row.querySelectorAll(['button[role="snip"]', 'button[role="skip"]']))
        )).flat()

        blockIcons?.forEach(icon => {
            if (!icon) return

            icon.style.display = hide ? 'none' : 'flex'
        })
    }

    #getRowIcons(row) {
        return Array.from(row.querySelectorAll(['button[role="snip"]', 'button[role="skip"]']))
    }

    #setMouseEvents(row) {
        const song = trackSongInfo(row)
        if (!song) return

        this.#events.forEach(event => {
            row?.addEventListener(event, () => {
                const snipInfo = this.#snipIcon.getTrack(song.id)
                const icons = this.#getRowIcons(row)
                const keys = { snip: 'isSnip', skip: 'isSkipped' }

                icons.forEach(icon => {
                      icon.style.visibility = this.#visibleEvents.includes(event) ? 'visible' : 'hidden'
                      this.#snipIcon._burn({ icon, burn: snipInfo[keys[icon.role]] })
                      this.#snipIcon._glow({ icon, glow: snipInfo[keys[icon.role]] })
                })
            })
        })
    }

    setTrackListClickEvent() {
        const trackList = document.querySelector('[data-testid="track-list"]')
        const container = trackList?.querySelector('[data-testid="top-sentinel"] + [role="presentation"]')
        if (!container) return

        this.#previousRowNum = null

        container.addEventListener('click', async e => {
            const target = e.target

            if (['snip', 'skip'].includes(target?.role)) {
                let row = target.parentElement
                do {
                    row = row.parentElement
                } while (row.dataset.testid != 'tracklist-row')

                const currentIndex = row.parentElement.ariaRowIndex

                if (target.role == 'snip') {
                    if (!this.#previousRowNum || (currentIndex != this.#previousRowNum)) {
                        this.#chorus.show()
                        this.#trackSnip.init(row)
                        this.#trackSnip.updateView()
                    } else if (currentIndex == this.#previousRowNum) {
                        this.#chorus.toggle()
                    }
                    
                    this.#previousRowNum = currentIndex 
                } else {
                    const icon = row.querySelector('button[role="skip"]')
                    await this.#skipIcon._saveTrack(row)
                    this.#skipIcon._animate(icon)
                }
            }
        })
    }

    #setRowEvents() {
        this.#trackRows.forEach(row => {
            this.#icons.forEach(icon => {
                icon.setUI(row)
                icon.setInitialState(row)
            })
            this.#setMouseEvents(row)
        })
    }
}
