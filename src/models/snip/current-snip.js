import Snip from './snip.js'

import { playback } from '../../utils/playback.js'
import { currentSongInfo } from '../../utils/song.js'
import { spotifyVideo } from '../../actions/overload.js'

export default class CurrentSnip extends Snip {
    constructor(songTracker) {
        super()
        this._songTracker = songTracker
        this._video = spotifyVideo.element
    }

    init() {
        super.init()

        this._controls.init()
        this.#displayTrackInfo()
        this._controls.setInitialValues(this.read())
    }

    #displayTrackInfo() {
        const { id } = currentSongInfo() 
        const [title, artists] = id.split(' by ')
        super._setTrackInfo({ title, artists })
    }

    get _defaultTrack() {
        return {
            id: currentSongInfo().id,
            value: {
                startTime: 0,
                isSnip: false,
                isSkipped: false,
                endTime: playback.duration(),
            },
        }
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

    async save() {
        const { inputLeft, inputRight } = this._elements
        const { isSkipped } = await this.read()

        await this._store.saveTrack({
            id: currentSongInfo().id,
            value: {
                isSnip: true,
                startTime: inputLeft.value,
                endTime: inputRight.value,
                isSkipped: inputRight.value == 0 || isSkipped,
            },
        })

        this.updateView()

        const updatedValues = await this.read()
        this.skipTrackOnSave(updatedValues)
        this._songTracker.currentSongState = updatedValues
    }
}
