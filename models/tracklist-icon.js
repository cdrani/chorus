import { timeToSeconds } from '../utils/time.js'

export default class TrackListIcon {
    #key
    #store
    #selector
    #visibleEvents = ['focus', 'mouseenter']
    #events = ['focus', 'mouseenter', 'blur', 'mouseleave']

    constructor({ key, store, selector }) {
        this.#key = key
        this.#store = store      
        this.#selector = selector
    }

    #getIcon(row) {
        return row.querySelector(this.#selector)
    }

    _setUI(row) {
        if (!row) return

        if (!this.#getIcon(row)) {
            const heartIcon = row.querySelector('button[data-testid="add-button"]')
            heartIcon.insertAdjacentHTML('beforebegin', this._iconUI)
        }

        const icon = this.#getIcon(row)
        icon.style.display = 'flex'
    }

    _setInitialState(row) {
        const icon = this.#getIcon(row)

        this.#initializeTrack(row)
        this._animate(icon)
    }

    #initializeTrack(row) {
        const songInfo = this._songInfo(row)

        if (!songInfo) return

        return this.#store.getTrack({ 
            id: songInfo.id, 
            value: { isSkipped: false, isSnip: false, startTime: 0, endTime: songInfo.endTime }
        })
    }

    getTrack(id) {
        return this.#store.getTrack({ id })
    }

    async _saveTrack(row) {
        const song = this._songInfo(row)
        if (!song) return

        const snipInfo = this.getTrack(song.id)

        await this.#store.saveTrack({ 
            id: song.id,
            value: { ...snipInfo, isSkipped: !snipInfo.isSkipped }
        })
    }
    
    #getArtists(row) {
        const artistsList = row.querySelectorAll('span > a')

        if (!artistsList.length) {
            // Here means we are at artist page and can get name from h1
            return document.querySelector('span[data-testid="entityTitle"] > h1').textContent
        }

        return Array.from(artistsList)
            .filter(artist => artist.href.includes('artist'))
            .map(artist => artist.textContent)
            .join(', ')
    }

    _songInfo(row) {
        const song = row?.querySelector('a > div')?.textContent || 
            row?.querySelector('div[data-encore-id="type"]')?.textContent
        const songLength = row?.querySelector('button[data-testid="add-button"] + div')?.textContent

        if (!songLength) return

        const artists = this.#getArtists(row)

        return {
            id:  `${song} by ${artists}`,
            endTime: timeToSeconds(songLength)
        }
    }

    #getRow(icon) {
        return icon.parentElement.parentElement
    }

    _animate(icon) {
        const row = this.#getRow(icon)
        const song = this._songInfo(row)

        if (!song) return

        const snipInfo = this.getTrack(song.id)

        this._burn({ icon, burn: snipInfo[this.#key] })
        this._glow({ icon, glow: snipInfo[this.#key] })
    }

    _burn({ icon, burn }) {
        const svg = icon.querySelector('svg')
        if (burn) {
            icon.style.visibility = 'visible'
        }

        if (this.#key == 'isSkipped') {
            icon.setAttribute('aria-label', `${burn ? 'Uns' : 'S'}kip Song`)
        }

        svg.style.fill = burn ? '#1ed760' : 'currentColor'
    }

    _setMouseEvents(icon) {
        const row = this.#getRow(icon)
        const song = this._songInfo(row)
        if (!song) return

        this.#events.forEach(event => {
            row?.addEventListener(event, () => {

                const snipInfo = this.getTrack(song.id)

                icon.style.visibility = this.#visibleEvents.includes(event) ? 'visible' : 'hidden'
                this._burn({ icon, burn: snipInfo[this.#key] })
            })
        })
    }

    _glow({ icon, glow }) {
        const svg = icon.querySelector('svg')

        svg.addEventListener('mouseover', () => {
            if (glow && svg.style.fill == '#1ed760') return

            svg.style.fill = glow ? '#1ed760' : '#fff'
        })

        svg.addEventListener('mouseleave', () => {
            if (glow && svg.style.fill == '#1ed760') return

            svg.style.fill = glow ? '#1ed760' : 'currentColor'
        })
    }
}
