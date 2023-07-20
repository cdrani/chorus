import SkipIcon from './skip-icon.js'
import SnipIcon from './snip-icon.js'

import { songInfo } from '../utils/song.js'

export default class TrackList {
    #icons
    #snipIcon
    #skipIcon
    #visibleEvents = ['mouseenter', 'focus']
    #events = ['mouseenter', 'focus', 'blur', 'mouseleave']
    
    constructor(store) {
        this.#skipIcon = new SkipIcon(store)
        this.#snipIcon = new SnipIcon(store)  
        this.#icons = [this.#skipIcon, this.#snipIcon]
    }

    get #trackRows() {
        const trackRows = document.querySelectorAll('[data-testid="tracklist-row"]')
        return trackRows?.length > 0 ? Array.from(trackRows) : undefined
    }

    setUpBlocking() {
        const trackRows = this.#trackRows
        if (!trackRows?.length) return

        this.#toggleBlockDisplay(false)
        this.#setRowEvents()
    }

    removeBlocking() {
        if (!this.trackRows?.length) return
        
        this.#toggleBlockDisplay(true)
    }

    #toggleBlockDisplay(hide) {
        const blockIcons = this.#trackRows.map(row => { 
            return Array.from(row.querySelectorAll(['button[role="blocker"]']))
        }).flat()

        blockIcons?.forEach(icon => { 
            if (!icon) return

            icon.style.display = hide ? 'none' : 'block'
        })
    }

    #getRowIcons(row) {
        return Array.from(row.querySelectorAll(['button[role="snip"]', 'button[role="skip"]']))
    }

    #setMouseEvents(row) {
        const song = songInfo(row)
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

    #setRowEvents() {
        this.#trackRows.forEach(row => {
            this.#icons.forEach(icon => {
                icon.setUI(row)
                icon.setInitialState(row)
                icon.setClickEvent(row)
            })
            
            this.#setMouseEvents(row)
        }) 
    }
}
