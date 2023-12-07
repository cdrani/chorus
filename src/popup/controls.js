import { SVG_PATHS } from './ui.js'
import { parseNodeString } from '../utils/parser.js'

class ExtControls {
    constructor() {
        this._port = null
        this._colours = {}
        this._eventsSet = false
    }

    initialize(port) {
        this._port = port
        this.setupEvents()
    }

    setupEvents() {
        if (this._eventsSet) return

        Object.values(this.btns).forEach(btn => {
            btn.onclick = () => { this._port.postMessage({ type: 'controls', key: btn.getAttribute('role') }) }
        })

        this._eventsSet = true 
    }

    updateControlsState(active) {
        document.body.style.height = active ? '118px' : '88px'

        const mediaContainer = document.getElementById('media-controls')
        mediaContainer.style.display = active ? 'flex' : 'none'
    }

    setFill({ backgroundColour, textColour }) {
        this._colours = { backgroundColour, textColour }
        const { playBtn } = this.btns
        const { rwSpan, ffSpan } = this.spans
        const { 
            playIcon, heartIcon, repeatIcon, shuffleIcon, blockIcon, nextIcon, previousIcon, rwIcon, ffIcon
        } = this.icons

        playBtn.style.backgroundColor = textColour
        playIcon.style.fill = backgroundColour

        shuffleIcon.style.stroke = textColour
        shuffleIcon.style.fill = textColour
        blockIcon.style.stroke = textColour
        blockIcon.style.fill = textColour
        heartIcon.style.stroke = textColour
        heartIcon.style.strokeWidth = 1.5

        previousIcon.style.fill = textColour
        nextIcon.style.fill = textColour
        repeatIcon.style.fill = textColour
        repeatIcon.style.stroke = textColour
        repeatIcon.style.strokeWidth = 0.2

        rwIcon.style.stroke = textColour
        rwIcon.style.strokeWidth = 6 
        rwSpan.style.color = textColour

        ffIcon.style.stroke = textColour
        ffIcon.style.strokeWidth = 6
        ffSpan.style.color = textColour
    }

    get spans() {
        return { rwSpan: document.getElementById('seek-rw'), ffSpan: document.getElementById('seek-ff') }
    }

    #getPathKey({ type, key, result }) {
        if (key == 'play/pause') return (type == 'state') ? result : (result == 'play' ? 'pause' : 'play')

        if (type == 'controls') return result?.includes('one') ? 'repeat1' : 'repeat'
        return result?.includes('disable') ? 'repeat1' : 'repeat'
    }

    #updateHeart({ svg, state }) {
        const hearted = state?.includes('remove')
        svg.style.fill = hearted ? this._colours.textColour : 'none'
    }

    #updateShuffle({ type, key, svg, state }) {
        const { textColour } = this._colours
        svg.style.stroke = textColour
        svg.style.fill = textColour

        const span = document.getElementById(`${key}-dot`)
        const enabled = type == 'state' ? state?.includes('disable') : state?.includes('enable')
        span.style.display = enabled ? 'inline' : 'none'
        span.style.backgroundColour = textColour
    }

    #updateRepeat({ type, key, svg, state }) {
        const { textColour } = this._colours
        svg.style.stroke = textColour
        svg.style.fill = textColour

        const span = document.getElementById(`${key}-dot`)
        const enabled = type == 'state' ? state?.search(/(one)|(disable)/g) >= 0 : state?.includes('enable')
        span.style.display = enabled ? 'inline' : 'none'
        span.style.backgroundColour = textColour
    }

    updateIcons({ type, key, result }) {
        if (!['play/pause', 'repeat', 'save/unsave', 'shuffle'].includes(key)) return

        const btn = document.querySelector(`[role="${key}"]`)
        const svg = btn.lastElementChild

        if (key == 'save/unsave') return this.#updateHeart({ svg, state: result })
        if (key == 'shuffle') return this.#updateShuffle({ type, key, svg, state: result })

        const pathKey = this.#getPathKey({ type, key, result })
        const newPath = parseNodeString('<svg xmlns="http://www.w3.org/2000/svg">' + SVG_PATHS[pathKey] + '</svg>')
        svg.replaceChildren(...newPath.childNodes)

        if (key == 'repeat') return this.#updateRepeat({ type, key, svg, state: result })

        const { textColour, backgroundColour } = this._colours
        svg.style.fill = key == 'play/pause' ? backgroundColour : textColour
        key != 'play/pause' && (svg.style.stroke = textColour)
    }

    updateUIState({ type, data }) {
        data.forEach(({ key, data }) => this.updateIcons({ type, key, result: data }))
    }

    get btns() {
        return {
            ffBtn: document.getElementById('ff-btn'),
            rwBtn: document.getElementById('rw-btn'),
            nextBtn: document.getElementById('next-btn'),
            playBtn: document.getElementById('play-btn'),
            heartBtn: document.getElementById('heart-btn'),
            blockBtn: document.getElementById('block-btn'),
            repeatBtn: document.getElementById('repeat-btn'),
            shuffleBtn: document.getElementById('shuffle-btn'),
            previousBtn: document.getElementById('previous-btn'),
        }
    }

    get icons() {
        return {
            ffIcon: document.getElementById('ff-icon'),
            rwIcon: document.getElementById('rw-icon'),
            playIcon: document.getElementById('play-icon'),
            nextIcon: document.getElementById('next-icon'),
            heartIcon: document.getElementById('heart-icon'),
            blockIcon: document.getElementById('block-icon'),
            repeatIcon: document.getElementById('repeat-icon'),
            shuffleIcon: document.getElementById('shuffle-icon'),
            previousIcon: document.getElementById('previous-icon'),
        }
    }
}

export const extControls = new ExtControls()
