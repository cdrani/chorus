import { trackSongInfo } from '../../utils/song.js'

export default class TrackListIcon {
    #key
    #store
    #selector

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
        const song = trackSongInfo(row)
        if (!song) return

        return this.#store.getTrack({
            id: song.id,
            value: { isSkipped: false, isSnip: false, startTime: 0, endTime: song.endTime },
        })
    }

    getTrack(id) {
        return this.#store.getTrack({ id })
    }

    async _saveTrack(row) {
        const song = trackSongInfo(row)
        if (!song) return

        const snipInfo = this.getTrack(song.id)

        await this.#store.saveTrack({
            id: song.id,
            value: { ...snipInfo, isSkipped: !snipInfo.isSkipped },
        })
    }

    #getRow(icon) {
        return icon.parentElement.parentElement
    }

    _animate(icon) {
        const row = this.#getRow(icon)
        const song = trackSongInfo(row)

        if (!song) return

        const snipInfo = this.getTrack(song.id)

        this._burn({ icon, burn: snipInfo[this.#key] })
        this._glow({ icon, glow: snipInfo[this.#key] })
    }

    #getStyleProp(icon) {
        return icon.role == 'snip' ? 'color' : 'fill'
    }

    _burn({ icon, burn }) {
        const svg = icon.querySelector('svg')
        if (burn) {
            icon.style.visibility = 'visible'
        }

        if (icon.role == 'skip') {
            icon.setAttribute('aria-label', `${burn ? 'Uns' : 'S'}kip Song`)
        }

        const styleProp = this.#getStyleProp(icon)
        svg.style[styleProp] = burn ? '#1ed760' : 'currentColor'
    }

    _glow({ icon, glow }) {
        const svg = icon.querySelector('svg')
        const styleProp = this.#getStyleProp(icon)

        svg.addEventListener('mouseover', () => {
            if (glow && svg.style[styleProp] == '#1ed760') return

            svg.style[styleProp] = glow ? '#1ed760' : '#fff'
        })

        svg.addEventListener('mouseleave', () => {
            if (glow && svg.style[styleProp] == '#1ed760') return

            svg.style[styleProp] = glow ? '#1ed760' : 'currentColor'
        })
    }
}
