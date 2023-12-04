class ExtControls {
    constructor() {
        this._port = null
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

    setFill({ backgroundColour, textColour }) {
        const { playBtn } = this.btns
        const { playIcon, heartIcon, shuffleIcon, blockIcon, nextIcon, previousIcon, rwIcon, ffIcon } = this.icons

        playBtn.style.backgroundColor = textColour
        playIcon.style.fill = backgroundColour

        shuffleIcon.style.stroke = textColour
        blockIcon.style.stroke = textColour
        heartIcon.style.stroke = textColour

        previousIcon.style.fill = textColour
        nextIcon.style.fill = textColour

        rwIcon.style.stroke = textColour
        rwIcon.style.strokeWidth =8 
        ffIcon.style.stroke = textColour
        ffIcon.style.strokeWidth = 8
    }

    get btns() {
        return {
            playBtn: document.getElementById('play-btn'),
            heartBtn: document.getElementById('heart-btn'),
            blockBtn: document.getElementById('block-btn'),
            ffBtn: document.getElementById('ff-btn'),
            rwBtn: document.getElementById('rw-btn'),
            nextBtn: document.getElementById('next-btn'),
            previousBtn: document.getElementById('previous-btn'),
            shuffleBtn: document.getElementById('shuffle-btn'),
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
            shuffleIcon: document.getElementById('shuffle-icon'),
            previousIcon: document.getElementById('previous-icon'),
        }
    }
}

export const extControls = new ExtControls()
