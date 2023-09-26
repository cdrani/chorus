import { createSeekIcon } from '../../components/seek/seek-icon.js'

import { currentData } from '../../data/current.js'
import { songState } from '../../data/song-state.js'
import { parseNodeString } from '../../utils/parser.js'
import { spotifyVideo } from '../../actions/overload.js'

export default class SeekIcons {
    #data
    #spotifySeekIcons = {}
    #video = spotifyVideo.element

    async init() {
        this.#removeCurrentSpotifySeekIcons()
        this.#placeIcons()
        await this.setSeekLabels()
        this.#setupListeners()
    }

    async #setData() {
        this.#data = await currentData.getSeekValues()
        return this.#data
    }
    
    get seekType() {
        const anchor = document.querySelector('[data-testid="context-item-info-title"] > span > a')
        // album, track, episode, chapter
        const contextType = anchor?.getAttribute('href')?.split('/')?.at(1)
        
        return ['track', 'album'].includes(contextType) ? 'global' : 'shows'
    }

    removeIcons() {
        const seekBack = document.getElementById('seek-player-rw-button')
        const seekForward = document.getElementById('seek-player-ff-button')

        seekBack.style.display = 'none'
        seekForward.style.display = 'none'

        if (!this.#spotifySeekIcons.ff) return
        this.#spotifySeekIcons.ff.style.display = 'flex'
        this.#spotifySeekIcons.rw.style.display = 'flex'
    }

    #placeIcons() {
        const rwIconButton = document.getElementById('seek-player-rw-button')
        const ffIconButton = document.getElementById('seek-player-ff-button')

        if (rwIconButton) {
            rwIconButton.style.display = 'flex'
            ffIconButton.style.display = 'flex'
            return
        }

        const skipForward = document.querySelector('[data-testid="control-button-skip-forward"]')
        const skipBack = document.querySelector('[data-testid="control-button-skip-back"]')

        const ffIcon = parseNodeString(this.ffIcon)
        const rwIcon = parseNodeString(this.rwIcon)

        if (this.seekType == 'shows') this.#removeCurrentSpotifySeekIcons()

        skipForward.parentElement.insertBefore(ffIcon, skipForward.nextSibling)
        skipBack.parentElement.insertBefore(rwIcon, skipBack)
    }

    #resetRWIcon() {
        const skipBack = document.querySelector('[data-testid="control-button-skip-back"]')
        const rwIcon = document.getElementById('seek-player-rw-button')
        skipBack.parentElement.insertBefore(rwIcon, skipBack)
    }

    async setSeekLabels() {
        const data = await this.#setData()

        this.#removeCurrentSpotifySeekIcons()
        this.#resetRWIcon()

        const rwIconLabel = document.getElementById('seek-icon-rw-label')
        const ffIconLabel = document.getElementById('seek-icon-ff-label')
        
        const seekType = this.seekType
        rwIconLabel.textContent = data[seekType].rw
        ffIconLabel.textContent = data[seekType].ff
    }

    #removeCurrentSpotifySeekIcons() {
        if (this.seekType == 'global') return

        const spotifyRWIcon = document.querySelector('[data-testid="control-button-seek-back-15"]')
        const spotifyFFIcon = document.querySelector('[data-testid="control-button-seek-forward-15"]')

        this.#spotifySeekIcons = { ff: spotifyFFIcon, rw: spotifyRWIcon }

        if (spotifyRWIcon?.style?.display == 'none') return

        if (spotifyRWIcon && spotifyFFIcon) {
            spotifyRWIcon.style.display = 'none'
            spotifyFFIcon.style.display = 'none'
        }
    }

    async #calculateCurrentTime({ role, seekTime }) {
        const { startTime, endTime } = await songState()
        const currentTime = this.#video.currentTime
        const newTimeFF = Math.min(parseInt(currentTime + seekTime, 10), parseInt(endTime, 10))
        const newTimeRW = Math.max(parseInt(currentTime - seekTime, 10), parseInt(startTime, 10))
        
        return role == 'ff' ? newTimeFF : newTimeRW
    }

    async #handleSeekButton(e) {
        const button = e.target
        const role = button.getAttribute('role')
        const seekTime = parseInt(button.firstElementChild.textContent, 10)

        const newTime = await this.#calculateCurrentTime({ role, seekTime })
        this.#video.currentTime = { source: 'chorus', value: newTime }
    }

    #setupListeners() {
        const rwIconButton = document.getElementById('seek-player-rw-button')
        const ffIconButton = document.getElementById('seek-player-ff-button')

        rwIconButton.onclick = e => this.#handleSeekButton(e)
        ffIconButton.onclick = e => this.#handleSeekButton(e)
    }

    get rwIcon() {
        return createSeekIcon('rw')
    }

    get ffIcon() {
        return createSeekIcon('ff')
    }
}
