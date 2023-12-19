import { store } from '../stores/data.js'
import { currentData } from '../data/current.js'
import { spotifyVideo } from '../actions/overload.js'

import { playback } from '../utils/playback.js'
import { parseNodeString } from '../utils/parser.js'
import { highlightLoopIcon } from '../utils/higlight.js'

export default class LoopIcon {
    constructor(songTracker) { 
        this._songTracker = songTracker
        this._video = spotifyVideo.element
    }

    init() { this.#placeIcon(); this.#setupListeners() }

    get #autoLoopUI() {
        return `
            <button
                role="loop"
                id="loop-button"
                class="chorus-hover-white"
                aria-label="Loop Snip/Track"
                style="display:flex;justify-content:center;align-items:center;border:none;background:none;"
            >
                <svg 
                    role="loop"
                    height="1.25rem"
                    width="1.25rem"
                    id="loop-icon"
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <g id="loop-group" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48">
                        <path d="m256 256s-48-96-126-96c-54.12 0-98 43-98 96s43.88 96 98 96c30 0 56.45-13.18 78-32"/>
                        <path d="m256 256s48 96 126 96c54.12 0 98-43 98-96s-43.88-96-98-96c-29.37 0-56.66 13.75-78 32"/>
                    </g>
                </svg>
            </button>
        `
    }

    get #loopButton() { return document.getElementById('loop-button') }

    #placeIcon() {
        const skipForwardButton = document.querySelector('[data-testid="control-button-skip-forward"]')
        const loopButton = parseNodeString(this.#autoLoopUI)
        skipForwardButton?.parentElement?.appendChild(loopButton)
    }

    updateIconPosition() {
        const skipForwardButton = document.querySelector('[data-testid="control-button-skip-forward"]')
        const parentElement = skipForwardButton?.parentElement
        parentElement?.insertBefore(this.#loopButton, parentElement.lastElementChild.nextSibling)
    }

    get #isHiglighted() {
        const group =  document.getElementById('loop-group')
        if (!group) return false

        return group.style.stroke == '#1ed760'
    }
    
    highlightIcon({ isSnip, autoLoop = false }) { 
        if (!isSnip && autoLoop) {
            this._video.element.setAttribute('startTime', 0)
            this._video.element.setAttribute('endTime', playback.duration())
        }
        if (isSnip) { this._video.resetTempTimes() }

        this.#loopButton.setAttribute('aria-label', autoLoop ? 'Remove Loop' : `Loop ${isSnip ? 'Snip' : 'Track'}` )
        highlightLoopIcon(autoLoop) 
    }

    removeIcon() { this.#loopButton?.remove() }

    async #handleLoopButton() {
        const track = await currentData.readTrack()
        const autoLoop = track.isSnip ? !track?.autoLoop : !this.#isHiglighted
        this.highlightIcon({ isSnip: track.isSnip, autoLoop })

        if (!track.isSnip) return

        const updatedTrack = await store.saveTrack({ id: track.id, value: { ...track, autoLoop }})
        await this._songTracker.updateCurrentSongData(updatedTrack)
    }

    #setupListeners() { this.#loopButton.onclick = () => this.#handleLoopButton() }
}

