import Snip from './snip.js'

import { playback } from '../../utils/playback.js'
import { currentSongInfo } from '../../utils/song.js'

export default class CurrentSnip extends Snip {
    constructor() {
        super()
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

    async save() {
        const { inputLeft, inputRight } = this._elements
        const { isSkipped } = this.read()

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

        const { isSkipped: updatedSkipValue }  = this.read()
        if (updatedSkipValue) {
            document.querySelector('[data-testid="control-button-skip-forward"]')?.click()   
        }
    }
}
