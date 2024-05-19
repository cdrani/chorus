import { parseNodeString } from '../utils/parser.js'
import { highlightIconTimer } from '../utils/highlight.js'

import Dispatcher from '../events/dispatcher.js'
import { currentData } from '../data/current.js'
import { createIcon, HEART_ICON } from '../components/icons/icon.js'

export default class HeartIcon {
    constructor(type = 'current') {
        this._type = type
        this._dispatcher = new Dispatcher()
    }

    init() { this.#placeIcon(); this.#setupListener(); }

    removeIcon() {
        this.#heartIcon?.remove()
        this.#toggleNowPlayingButton(true)
    }

    #placeIcon() {
        const heartButton = parseNodeString(this.#createHeartIcon)
        const refNode = this.#nowPlayingButton
        refNode.parentElement.insertBefore(heartButton, refNode)
        this.#toggleNowPlayingButton(false)
    }

    #toggleNowPlayingButton(show) {
        const button = this.#nowPlayingButton
        button.style.visibility = show ? 'visible' : 'hidden'
        button.style.padding = show ? '0.5rem' : 0
        button.style.width = show ? '1rem' : 0
    }

    get #createHeartIcon() {
        return createIcon(HEART_ICON)
    }

    get #heartIcon() {
        return document.querySelector('#chorus-heart')
    }

    #setupListener() {
        this.#heartIcon?.addEventListener('click', async () => this.#handleClick())
    }

    async #dispatchLikedTracks() {
        const method = this.#isHeartIconHighlighted ? 'DELETE' : 'PUT'
        const { trackId: id } = await currentData.readTrack()

        return await this._dispatcher.sendEvent({
            eventType: 'tracks.update',
            detail: { key: 'tracks.update', values: { id, method } },
        })
    }

    async #handleClick() {
        await this.#dispatchLikedTracks()
        this.highlightIcon(!this.#isHeartIconHighlighted)
    }

    get isCurrent() {
        return this._type == 'current'
    }

    get #nowPlayingButton() {
        return document.querySelector('div[data-testid="now-playing-widget"] > button[data-encore-id="buttonTertiary"]')
    }

    get #isSpotifyHighlighted() {
        const button = this.#nowPlayingButton
        if (!button) return false

        return JSON.parse(button.getAttribute('aria-checked'))
    }

    get #isHeartIconHighlighted() {
        return this.#heartIcon.firstElementChild.getAttribute('fill') != 'unset'
    }

    highlightIcon(highlight) {
        const update = highlight ?? this.#isSpotifyHighlighted
        highlightIconTimer({ 
            fill: true,
            highlight: update,
            selector: '#chorus-heart > svg',
        })

        this.#updateIconLabel(update)
    }

    #updateIconLabel(highlight) {
        const text = `${highlight ? 'Remove from' : 'Save to' } Liked`
        this.#heartIcon.setAttribute('aria-label', text)
    }
}
