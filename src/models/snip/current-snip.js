import Snip from './snip.js'

import { currentSongInfo } from '../../utils/song.js'
import { spotifyVideo } from '../../actions/overload.js'
import { currentData } from '../../data/current.js'

export default class CurrentSnip extends Snip {
    constructor(songTracker) {
        super()

        this._songTracker = songTracker
        this._video = spotifyVideo.element
    }

    async init() {
        super.init()

        this._controls.init()
        this.#displayTrackInfo()
        const track = await this.read()
        this._controls.setInitialValues(track)
    }

    #displayTrackInfo() {
        const { id } = currentSongInfo() 
        const [title, artists] = id.split(' by ')
        super._setTrackInfo({ title, artists })
    }

    get _defaultTrack() {
        return currentData.readTrack()
    }

    updateView() {
        super._updateView()
    }

    get trackURL() {
        const { url } = currentSongInfo()
        return url
    }

    share() {
        super._share()
    }

    skipTrackOnSave({ isSkipped }) {
        if (isSkipped) {
            document.querySelector('[data-testid="control-button-skip-forward"]')?.click()   
        }
    }

    setCurrentTime({ prevEndTime, endTime }) {
        const lastSetThumb = this._video.element.getAttribute('lastSetThumb')

        if (lastSetThumb !== 'end') return
        this._video.currentTime = Math.max(Math.min(prevEndTime, endTime) - 5, 1)
    }

    async delete() {
        await super._delete()
        const updatedValues = await this.read()
        await this._songTracker.updateCurrentSongData(updatedValues)
    }

    async save() {
        const { inputLeft, inputRight } = this._elements
        const track = await this.read()
        const { id, isSkipped, endTime: prevEndTime } = track

        const result = await this._store.saveTrack({
            id,
            value: {
                ...track,
                isSnip: true,
                startTime: inputLeft.value,
                endTime: inputRight.value,
                isSkipped: inputRight.value == 0 || isSkipped,
            },
        })

        this.updateView()
        this.skipTrackOnSave(result)
        this.setCurrentTime({ prevEndTime, endTime: result.endTime })

        await this._songTracker.updateCurrentSongData(result)
    }
}
