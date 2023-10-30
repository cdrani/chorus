import { store } from '../stores/data.js'

import { playback } from '../utils/playback.js'
import { currentSongInfo } from '../utils/song.js'

class CurrentData {
    constructor(store) {
        this._store = store
    }

    get #isShowingModal() {
        const mainElement = document.getElementById('chorus-main')
        if (!mainElement) return false

        return mainElement.style.display == 'block'
    }

    get songId() {
        if (!this.#isShowingModal) return currentSongInfo().id

        const title = document.getElementById('track-title')?.textContent
        const artists = document.getElementById('track-artists')?.textContent
        return `${title} by ${artists}`
    }

    get #trackDefaults() {
        return {
            ...currentSongInfo(),
            startTime: 0,
            isSnip: false,
            isSkipped: false,
            endTime: playback.duration()
        }
    }

    async getPlaybackValues() {
        const track = await this.readTrack()
        const globals = await this.readGlobals()

        const preferredRate = track?.playbackRate ?? globals?.playbackRate ?? 1
        const preferredPitch = track?.preservesPitch ?? globals.preservesPitch ?? true

        return {
            preferredRate,
            preferredPitch,
            globals: { 
                playbackRate: globals.playbackRate,
                preservesPitch: globals.preservesPitch,
                speedCheckboxChecked: globals?.speedCheckboxChecked ?? true,
                pitchCheckboxChecked: globals?.speedCheckboxChecked ?? true
            },
            track: { 
                playbackRate: track.playbackRate,
                preservesPitch: track.preservesPitch
            }
        }
    }

    async getSeekValues() {
        return await this._store.getTrack({
            id: 'chorus-seek',
            value: {
                shows: { ff: 15, rw: 15 },  // audiobooks, podcasts, (longform audio)
                global: { ff: 10, rw: 10 }, // albums, playlists, tracks (shortform audio)
            }
        })
    }

    async readTrack() {
        return await this._store.getTrack({ id: currentSongInfo().id, value: this.#trackDefaults })
    }

    async readGlobals() {
        return await this._store.getTrack({
            id: 'globals',
            value: { playbackRate: 1, preservesPitch: true }
        })
    }
}
 
export const currentData = new CurrentData(store)
