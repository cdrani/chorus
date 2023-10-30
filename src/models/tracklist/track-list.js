import SkipIcon from './skip-icon.js'
import SnipIcon from './snip-icon.js'

import Chorus from '../chorus.js'
import TrackSnip from '../snip/track-snip.js'

import { store } from '../../stores/data.js'
import { trackSongInfo } from '../../utils/song.js'

export default class TrackList {
    constructor(songTracker) {
        this._chorus = new Chorus(songTracker)
        this._skipIcon = new SkipIcon(store)
        this._snipIcon = new SnipIcon(store)
        this._trackSnip = new TrackSnip(store)

        this._visibleEvents = ['mouseenter']
        this._events = ['mouseenter', 'mouseleave']
        
        this._icons = [
            this._skipIcon , // this._snipIcon
        ]
        this._previousRowNum = null
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

        this._events.forEach(event => {
            row?.addEventListener(event, async () => {
                const snipInfo = await this._snipIcon.getTrack(song.id)
                const icons = this.#getRowIcons(row)
                const keys = { snip: 'isSnip', skip: 'isSkipped' }

                icons.forEach(icon => {
                      icon.style.visibility = this._visibleEvents.includes(event) ? 'visible' : 'hidden'
                      const role = icon.getAttribute('role')
                      this._snipIcon._burn({ icon, burn: snipInfo[keys[role]] })
                      this._snipIcon._glow({ icon, glow: snipInfo[keys[role]] })
                })
            }, { once: true })
        })
    }

    #handleClick = async e => {
        const target = e.target
        const role = target?.getAttribute('role')

        if (['snip', 'skip'].includes(role)) {
            let row = target.parentElement
            do {
                row = row.parentElement
            } while (row.dataset.testid != 'tracklist-row')

            const currentIndex = row.parentElement.getAttribute('aria-row-index')

            if (role == 'snip') {
                if (!this._previousRowNum || (currentIndex != this._previousRowNum)) {
                    this._chorus.show()
                    await this._trackSnip.init(row)
                } else if (currentIndex == this._previousRowNum) {
                    this._chorus.toggle()
                }
                
                const icon = row.querySelector('button[role="snip"]')
                this._snipIcon._animate(icon)
                this._previousRowNum = currentIndex 
            } else {
                const icon = row.querySelector('button[role="skip"]')
                await this._skipIcon._saveTrack(row)
                this._skipIcon._animate(icon)
            }
        }
    }

    setTrackListClickEvent() {
        const trackLists = Array.from(
            document.querySelectorAll([
                '[data-testid="track-list"]', 
                '[data-testid="playlist-tracklist"]'
            ])
        )
        const containers = trackLists?.map(trackList => (
            trackList.querySelector('[data-testid="top-sentinel"] + [role="presentation"]')
        ))

        if (!containers?.length) return

        this._previousRowNum = null

        containers.forEach(container => { 
            container?.removeEventListener('click', this.#handleClick)
            container?.addEventListener('click', this.#handleClick)
        })
    }

    #setRowEvents() {
        this.#trackRows.forEach(row => {
            this._icons.forEach(icon => {
                icon.setUI(row)
                icon.setInitialState(row)
            })
            this.#setMouseEvents(row)
        })
    }
}
