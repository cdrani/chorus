import { store } from '../../stores/data.js'
import { spotifyVideo } from '../../actions/overload.js'
import { clickOutside } from '../../utils/click-outside.js'

export default class EqualizerController {
    constructor() {
        this._store = store
        this._clickOutsideHandlers = []
        this._equalizer = spotifyVideo.equalizer
    }

    init() {
        const effect = this._store.getEqualizer() ?? 'none'
        this.#setupEvents(effect)
    }

    #setBtnBackground(e) {
        const isMouseOver = e.type == 'mouseover'
        this.style.background = isMouseOver ? '#3e3d3d' : '#171717'
    }

    #setupButtonListeners = (button) => {
        button.addEventListener('click', this.#handleSelection)
        button.addEventListener('mouseover', this.#setBtnBackground)
        button.addEventListener('mouseleave', this.#setBtnBackground)
    }

    #highlightFirstVisibleBtn() {
        const { eqList, eqEffect } = this.elements
        const selectedBtn = eqList.querySelector(`button[value="${eqEffect.textContent}"]`)
        eqList.scrollTop = selectedBtn.offsetTop - eqList.offsetTop
        selectedBtn.style.background = '#3e3d3d'
    }

    #resetBtnBackgrounds() {
        const { eqList } = this.elements
        const reset = (btn) => (btn.style.background = '#171717')
        ;[...eqList.children].forEach(reset)
    }

    #toggleListView = (e) => {
        e.preventDefault()
        const { eqList } = this.elements

        const isShowing = eqList.style.display == 'flex'
        eqList.style.display = isShowing ? 'none' : 'flex'

        if (eqList.style.display !== 'flex') return

        this.#resetBtnBackgrounds()
        this.#highlightFirstVisibleBtn()
    }

    #setupToggleBtnEvents(btn) {
        const clickHandler = clickOutside({ area: '#chorus-controls', node: btn })
        this._clickOutsideHandlers.push(clickHandler)

        btn.addEventListener('click', this.#toggleListView)
        btn.addEventListener('click_outside', () => {
            btn.nextElementSibling.style.display = 'none'
        })
    }

    destroyClickHandlers() {
        this._clickOutsideHandlers.forEach((handler) => handler?.destroy())
        this._clickOutsideHandlers = []

        this.#closeLists()
    }

    #closeLists() {
        const { eqList } = this.elements
        if (!eqList) return

        eqList.style.display = 'none'
    }

    #setupSelectEvents() {
        const { eqBtn, eqList } = this.elements

        this.#setupToggleBtnEvents(eqBtn)
        ;[...eqList.children].forEach(this.#setupButtonListeners)
    }

    #setupEvents(effect) {
        const { eqEffect, eqPresetSelection } = this.elements

        if (effect == 'none') {
            this.setValuesToNone()
        } else {
            eqPresetSelection.textContent = effect
            eqEffect.textContent = effect
        }

        this.#setupSelectEvents()
    }

    get elements() {
        return {
            eqBtn: document.getElementById('equalizer-effect-btn'),
            eqList: document.getElementById('equalizer-effect-list'),
            eqEffect: document.getElementById('equalizer-effect-selected'),
            eqPresetSelection: document.getElementById('equalizer-preset-selection')
        }
    }

    #handleSelection = async (e) => {
        e.preventDefault()

        const effect = e.target.value

        await this._equalizer.setEQEffect(effect)

        this.elements.eqEffect.textContent = effect
        this.elements.eqPresetSelection.textContent = effect

        this.#closeLists()
    }

    async saveSelection() {
        await this._store.saveEqualizer(this.elements.eqPresetSelection.textContent)
    }

    setValuesToNone() {
        const { eqPresetSelection, eqEffect } = this.elements
        eqPresetSelection.textContent = 'none'
        eqEffect.textContent = 'none'
    }

    async clearEqualizer() {
        this.setValuesToNone()
        await this.saveSelection()
        await this._equalizer.setEQEffect('none')
    }
}
