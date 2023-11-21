import { spotifyVideo } from '../../actions/overload.js'
import { store } from '../../stores/data.js'

export default class SnipSave {
    constructor(snip) {
        this._snip = snip
        this._store = store
        this._video = spotifyVideo.element
    }

    #skipTrackOnSave({ isSkipped }) {
        isSkipped && document.querySelector('[data-testid="control-button-skip-forward"]')?.click()   
    }

    #setCurrentTime({ prevEndTime, endTime }) {
        const lastSetThumb = this._video.element.getAttribute('lastSetThumb')
        if (lastSetThumb !== 'end') return

        this._video.currentTime = Math.max(Math.min(prevEndTime, endTime) - 5, 1)
    }

    async save({ id, startTime, endTime }) {
        const track = await this._store.getTrack({ id })
        const { isSkipped, endTime: prevEndTime } = track

        const result = await this._store.saveTrack({
            id,
            value: { id, ...track, endTime, startTime, isSnip: true, isSkipped: endTime == 0 || isSkipped },
        })

        this._snip.updateView(result)
        if (this._snip.name != 'CURRENT_SNIP') return

        this.#skipTrackOnSave(result)
        this.#setCurrentTime({ prevEndTime, endTime: result.endTime })

        await this._snip.updateCurrentSongData(result)
    }
}
