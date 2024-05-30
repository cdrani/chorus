import { parseNodeString } from '../utils/parser.js'
import { highlightIconTimer } from '../utils/highlight.js'

import { store } from '../stores/data.js'
import Dispatcher from '../events/dispatcher.js'
import { currentData } from '../data/current.js'
import { createIcon, HEART_ICON } from '../components/icons/icon.js'

export default class HeartIcon {
    constructor() {
        this._id = null
        this._dispatcher = new Dispatcher()
    }

    init() {
        this.#placeIcon()
        this.#setupListener()
    }

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

    async #dispatchIsInCollection(ids) {
        return await this._dispatcher.sendEvent({
            eventType: 'tracks.liked',
            detail: { key: 'tracks.liked', values: { ids } }
        })
    }

    async #dispatchGetTrackIdFromAlbum({ songId, albumId }) {
        const { state, data } = await this._dispatcher.sendEvent({
            eventType: 'tracks.album',
            detail: { key: 'tracks.album', values: { albumId } }
        })

        if (state == 'error') return null

        const foundTrack = data.tracks.items.find((track) => {
            const artists = track.artists.map((artist) => artist.name).join(',')
            const songTitle = `${track.name} by ${artists}`
            return songTitle == songId
        })

        if (!foundTrack) return null

        return foundTrack.id
    }

    async #dispatchLikedTracks() {
        const method = (await this.#isHeartIconHighlighted()) ? 'DELETE' : 'PUT'
        const { id: songId, trackId, type } = await currentData.readTrack()

        let likedTrackId = trackId
        if (type == 'album') {
            likedTrackId = await this.#dispatchGetTrackIdFromAlbum({ songId, albumId: trackId })
        }

        if (!likedTrackId) return false

        await this._dispatcher.sendEvent({
            eventType: 'tracks.update',
            detail: { key: 'tracks.update', values: { id: likedTrackId, method } }
        })

        return method == 'PUT'
    }

    async #handleClick() {
        const highlight = await this.#dispatchLikedTracks()
        this.highlightIcon(highlight)
    }

    get #nowPlayingButton() {
        return document.querySelector(
            'div[data-testid="now-playing-widget"] > button[data-encore-id="buttonTertiary"]'
        )
    }

    get #isSpotifyHighlighted() {
        const button = this.#nowPlayingButton
        if (!button) return false

        return JSON.parse(button.getAttribute('aria-checked'))
    }

    async #isHeartIconHighlighted() {
        const trackState = store.checkInCollection(this._id)
        if (trackState !== null) return trackState

        // If Spotify does not mark is 'curated', then it's not in ANY of user's playlists
        if (!this.#isSpotifyHighlighted) {
            store.saveInCollection({ id: this._id, saved: false })
            return false
        }

        return this.#heartIcon.firstElementChild.getAttribute('fill') != 'unset'
    }

    async #getIsTrackLiked() {
        if (!this._id) return false

        const trackState = store.checkInCollection(this._id)
        if (trackState !== null) return trackState

        if (this._type == 'album') {
            this._id = await this.#dispatchGetTrackIdFromAlbum(this._id)
        }
        const response = await this.#dispatchIsInCollection(this._id)

        const saved = response?.data?.at(0)
        store.saveInCollection({ id: this._id, saved })
        return saved
    }

    async highlightIcon(highlight) {
        this._id = null
        const { trackId, type = 'track', id: songId } = await currentData.readTrack()
        this._id = trackId

        let shouldUpdate = false

        if (typeof highlight !== 'undefined') {
            shouldUpdate = highlight
        } else {
            if (type == 'album') {
                this._id = await this.#dispatchGetTrackIdFromAlbum({ songId, albumId: trackId })
            }
            if (!this._id) return

            shouldUpdate = await this.#getIsTrackLiked()
        }

        highlightIconTimer({
            fill: true,
            highlight: shouldUpdate,
            selector: '#chorus-heart > svg'
        })

        this.#updateIconLabel(shouldUpdate)
        store.saveInCollection({ id: this._id, saved: shouldUpdate })
        this.#highlightInTracklist(shouldUpdate)
    }

    #highlightInTracklist(highlight) {
        if (!this._id) return

        const anchors = document.querySelectorAll(
            `a[data-testid="internal-track-link"][href="/track/${this._id}"]`
        )
        if (!anchors?.length) return

        anchors.forEach((anchor) => {
            const trackRow = anchor?.parentElement?.parentElement?.parentElement
            if (!trackRow) return

            const heartIcon = trackRow.querySelector('button[role="heart"]')
            if (!heartIcon) return

            const svg = heartIcon.querySelector('svg')
            if (!svg) return

            heartIcon.style.visibility = highlight ? 'visible' : 'hidden'

            heartIcon.setAttribute('aria-label', `${highlight ? 'Remove from' : 'Save to'} Liked`)
            svg.style.fill = highlight ? '#1ed760' : 'transparent'
            svg.style.stroke = highlight ? '#1ed760' : 'currentColor'
        })
    }

    #updateIconLabel(highlight) {
        const text = `${highlight ? 'Remove from' : 'Save to'} Liked`
        this.#heartIcon?.setAttribute('aria-label', text)
    }
}
