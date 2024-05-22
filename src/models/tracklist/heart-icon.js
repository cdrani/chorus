import TrackListIcon from './tracklist-icon.js'
import { TRACK_HEART, createIcon } from '../../components/icons/icon.js'

export default class HeartIcon extends TrackListIcon {
    constructor(store) {
        super({
            store,
            key: 'isLiked',
            selector: 'button[role="heart"]'
        })
    }

    isLiked(row) {
        const button = row.querySelector('button[data-encore-id="buttonTertiary"]')
        return JSON.parse(button.getAttribute('aria-checked'))
    }

    setInitialState(row) {
        const icon = row.querySelector(this._selector)
        this.animate(icon)
    }

    glow({ icon, glow }) {
        const svg = icon.querySelector('svg')

        svg.addEventListener('mouseover', () => {
            if (glow && svg.style.fill == '#1ed760') return

            svg.style.fill = glow ? '#1ed760' : 'unset'
            svg.style.stroke = glow ? '#1ed760' : '#fff'
        })

        svg.addEventListener('mouseleave', () => {
            if (glow && svg.style.fill == '#1ed760') return

            svg.style.fill = glow ? '#1ed760' : 'unset'
            svg.style.stroke = glow ? '#1ed760' : 'currentColor'
        })
    }

    animate(icon) {
        const isLiked = this.isLiked(icon.parentElement)
        this._burn({ icon, burn: isLiked })
        this.glow({ icon, glow: isLiked })
    }

    setUI(row) {
        super._setUI(row)
    }

    get _iconUI() {
        return createIcon(TRACK_HEART)
    }
}
