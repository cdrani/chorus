import { store } from '../../stores/data.js'
import { spotifyVideo } from '../../actions/overload.js'

export default class ReverbController {
    constructor() {
        this._store = store
        this._reverb = spotifyVideo.reverb
    }

    async init() {
        const effect = this._store.getReverb() ?? 'none'
        await this.#setupEvents(effect)
    }

    async #setupEvents(effect) {
        const { drinkEffectSelect } = this.elements

        drinkEffectSelect.value = effect
        await this._reverb.applyReverbEffect(effect)

        drinkEffectSelect.onchange = async () => { await this.handleSelection() }
    }

    get elements() {
        return { drinkEffectSelect: document.getElementById('drink-effect-presets') }
    }

    get selection() {
        const { drinkEffectSelect: { value } } = this.elements 
        return value
    }

    async handleSelection() {
        await this._reverb.applyReverbEffect(this.selection)
    }

    async saveSelection() {
        await this._store.saveReverb(this.selection)
    }
}
