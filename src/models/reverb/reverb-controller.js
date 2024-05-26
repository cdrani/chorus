import { store } from '../../stores/data.js'
import { spotifyVideo } from '../../actions/overload.js'
import { roomPresets } from '../../lib/reverb/presets.js'

export default class ReverbController {
    constructor() {
        this._store = store
        this._reverb = spotifyVideo.reverb
    }

    init() {
        const effect = this._store.getReverb() ?? 'none'
        this.#setupEvents(effect)
    }

    #setupEvents(effect) {
        const { roomEffectSelect, convolverEffectSelect, presetSelection } = this.elements

        if (effect == 'none') {
            this.setValuesToNone()
        } else {
            presetSelection.textContent = effect
            const selectedElement = roomPresets.includes(effect)
                ? roomEffectSelect
                : convolverEffectSelect
            selectedElement.value = effect
        }

        roomEffectSelect.onchange = async (e) => {
            await this.handleSelection(e)
        }
        convolverEffectSelect.onchange = async (e) => {
            await this.handleSelection(e)
        }
    }

    get elements() {
        return {
            presetSelection: document.getElementById('preset-selection'),
            roomEffectSelect: document.getElementById('room-effect-presets'),
            convolverEffectSelect: document.getElementById('convolver-effect-presets')
        }
    }

    async handleSelection(e) {
        const {
            target: { value, id }
        } = e
        await this._reverb.setReverbEffect(value)

        const { convolverEffectSelect, roomEffectSelect } = this.elements
        const nonSelectedElement = id?.startsWith('room') ? convolverEffectSelect : roomEffectSelect
        nonSelectedElement.value = 'none'

        this.elements.presetSelection.textContent = value
    }

    async saveSelection() {
        await this._store.saveReverb(this.elements.presetSelection.textContent)
    }

    setValuesToNone() {
        const { presetSelection, roomEffectSelect, convolverEffectSelect } = this.elements
        presetSelection.textContent = 'none'
        roomEffectSelect.value = 'none'
        convolverEffectSelect.value = 'none'
    }

    async clearReverb() {
        this.setValuesToNone()
        await this.saveSelection()
        await this._reverb.setReverbEffect('none')
    }
}
