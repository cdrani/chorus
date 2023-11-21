import Alert from '../alert.js'

import { store } from '../../stores/data.js'
import { spotifyVideo } from '../../actions/overload.js'

import { getTrackId } from '../../utils/song.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

export default class SnipSave {
    constructor(snip) {
        this._snip = snip
        this._store = store
        this._video = spotifyVideo.element

        this._alert = new Alert()
    }

    #skipTrackOnSave({ isSkipped }) {
        isSkipped && document.querySelector('[data-testid="control-button-skip-forward"]')?.click()   
    }

    async share({ tempStartTime, tempEndTime }) {
        const { startTime, endTime, playbackRate = '1.00', preservesPitch = true } = await this._snip.read()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 100

        const trackPath = this?.trackURL ?? `${location.origin}/track/${getTrackId()}`
        const start = tempStartTime ?? startTime
        const end = tempEndTime ?? endTime

        const shareURL = `${trackPath}?ch=${start}-${end}-${rate}-${pitch}`
        copyToClipBoard(shareURL)

        this._alert.displayAlert({ link: shareURL, linkMessage: 'Visit Shareable Snip', duration: 3500 })
    }

    async save({ id, startTime, endTime }) {
        const { isSkipped } = await this._store.getTrack({ id })

        const result = await this._store.saveTrack({
            id,
            value: { id, ...track, endTime, startTime, isSnip: true, isSkipped: endTime == 0 || isSkipped },
        })

        this._snip.updateView(result)
        if (this._snip.name != 'CURRENT_SNIP') return

        this.#skipTrackOnSave(result)
        this._video.currentTime = result.startTime

        await this._snip.updateCurrentSongData(result)
    }
}
