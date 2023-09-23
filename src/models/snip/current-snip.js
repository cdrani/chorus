import Snip from './snip.js'

import { playback } from '../../utils/playback.js'
import { currentSongInfo } from '../../utils/song.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

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

    _highlightSnip(isSnip) {
        // TODO: fixme
        const svgElement = document.getElementById('chorus-highlight')
        const fill = Boolean(isSnip) ? '#1ed760' : 'currentColor'

        if (!svgElement) return

        svgElement.style.stroke = fill
    }

    share() {
        const { url } = currentSongInfo()
        const { startTime, endTime, playbackRate = '1.00', preservesPitch = true } = this.read()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 100
        
        const shareURL = `${url}?ch=${startTime}-${endTime}-${rate}-${pitch}`
        copyToClipBoard(shareURL)

        super._displayAlert()
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
    }
}
