import { store } from '../stores/data.js'

import { playback } from '../utils/playback.js'
import { currentSongInfo } from '../utils/song.js'

class CurrentData {
    #store

    constructor(store) {
        this.#store = store
    }

    get #isShowingModal() {
        const mainElement = document.getElementById('chorus-main')

        if (!mainElement) return false

        return mainElement.style.display == 'block'
    }

    get songId() {
        if (this.#isShowingModal) {
            const title = document.getElementById('track-title')?.textContent
            const artists = document.getElementById('track-artists')?.textContent
            return `${title} by ${artists}`
        }

        return currentSongInfo().id
    }

    get #trackDefaults() {
        return {
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
        const seekValues = await this.#store.getTrack({
            id: 'chorus-seek',
            value: {
                shows: { ff: 15, rw: 15 }, // audiobooks, podcasts, (longform audio)
                global: { ff: 10, rw: 10 }, // albums, playlists, tracks (shortform audio)
            }
        })

        return seekValues
    }

    async readTrack() {
        const track = await this.#store.getTrack({
            id: this.songId,
            value: this.#trackDefaults
        })

        return track
    }

    async readGlobals() {
        const globals = await this.#store.getTrack({
            id: 'globals',
            value: {
                playbackRate: 1,
                preservePitch: true
            }
        })

        return globals
    }
}
 
export const currentData = new CurrentData(store)
