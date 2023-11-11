import { store } from '../../stores/data.js'
import { spotifyVideo } from '../../actions/overload.js'

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
        const { drinkEffectSelect, convolverEffectSelect, presetSelection } = this.elements
        effect == 'none' ? this.setValuesToNone() : (presetSelection.textContent = effect)

        drinkEffectSelect.onchange = async (e) => { await this.handleSelection(e) }
        convolverEffectSelect.onchange = async (e) => { await this.handleSelection(e) }
    }

    get elements() {
        return { 
            presetSelection: document.getElementById('preset-selection'),
            drinkEffectSelect: document.getElementById('drink-effect-presets'),
            convolverEffectSelect: document.getElementById('convolver-effect-presets') 
        }
    }

    async handleSelection(e) {
        const { target: { value } } = e
        await this._reverb.setReverbEffect(value)
        
        this.elements.presetSelection.textContent = value
    }

    async saveSelection() {
        await this._store.saveReverb(this.elements.presetSelection.textContent)
    }

    setValuesToNone() {
        const { presetSelection, drinkEffectSelect, convolverEffectSelect } = this.elements
        presetSelection.textContent = 'none' 
        drinkEffectSelect.value = 'none'
        convolverEffectSelect.value = 'none'
    }

    async clearReverb() {
        this.setValuesToNone()
        await this.saveSelection()
        await this._reverb.setReverbEffect('none')
    }
}
