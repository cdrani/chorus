import SkipIcon from './skip-icon.js'
import SnipIcon from './snip-icon.js'

export default class TrackList {
    #icons
    #snipIcon
    #skipIcon
    
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

    #setRowEvents() {
        this.#trackRows.forEach(row => {
            this.#icons.forEach(icon => {
                icon.setUI(row)
                icon.setInitialState(row)
                icon.setClickEvent(row)
                icon.setMouseEvents(row)
            })
        }) 
    }
}
