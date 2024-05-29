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

    #setBtnBackground(e) {
        const isMouseOver = e.type == 'mouseover'
        this.style.background = isMouseOver ? '#3e3d3d' : '#171717'
    }

    #setupButtonListeners = (button) => {
        button.addEventListener('click', this.#handleSelection)
        button.addEventListener('mouseover', this.#setBtnBackground)
        button.addEventListener('mouseleave', this.#setBtnBackground)
    }

    #highlightFirstVisibleBtn({ isRoom, effectList }) {
        const { roomEffect, convolverEffect } = this.elements
        const selectedEffect = isRoom ? roomEffect.textContent : convolverEffect.textContent
        const selectedBtn = effectList.querySelector(`button[value="${selectedEffect}"]`)

        effectList.scrollTop = selectedBtn.offsetTop - effectList.offsetTop
        selectedBtn.style.background = '#3e3d3d'
    }

    #toggleListView = (e) => {
        e.preventDefault()
        const { roomList, convolverList } = this.elements

        const isRoom = e.target.id.startsWith('room')
        const list = isRoom ? roomList : convolverList
        const otherList = isRoom ? convolverList : roomList

        const isShowing = list.style.display == 'flex'
        list.style.display = isShowing ? 'none' : 'flex'
        otherList.style.display = 'none'

        if (list.style.display !== 'flex') return

        this.#highlightFirstVisibleBtn({ isRoom, effectList: list })
    }

    #setupToggleBtnEvents(btn) {
        btn.addEventListener('click', this.#toggleListView)
    }

    #setupSelectEvents() {
        const { roomBtn, roomList, convolverBtn, convolverList } = this.elements

        this.#setupToggleBtnEvents(roomBtn)
        ;[...roomList.children].forEach(this.#setupButtonListeners)

        this.#setupToggleBtnEvents(convolverBtn)
        ;[...convolverList.children].forEach(this.#setupButtonListeners)
    }

    #setupEvents(effect) {
        const { roomEffect, convolverEffect, presetSelection } = this.elements

        if (effect == 'none') {
            this.setValuesToNone()
        } else {
            presetSelection.textContent = effect
            const selectedElement = roomPresets.includes(effect) ? roomEffect : convolverEffect
            selectedElement.textContent = effect
        }

        this.#setupSelectEvents()
    }

    get elements() {
        return {
            roomBtn: document.getElementById('room-effect-btn'),
            roomList: document.getElementById('room-effect-list'),
            roomEffect: document.getElementById('room-effect-selected'),

            convolverBtn: document.getElementById('convolver-effect-btn'),
            convolverList: document.getElementById('convolver-effect-list'),
            convolverEffect: document.getElementById('convolver-effect-selected'),

            presetSelection: document.getElementById('preset-selection')
        }
    }

    #handleSelection = async (e) => {
        e.preventDefault()

        const value = e.target.value
        await this._reverb.setReverbEffect(value)

        const { roomList, convolverList, convolverEffect, roomEffect } = this.elements
        const roomPresetUpdate = e.target?.parentElement?.id?.startsWith('room')

        convolverEffect.textContent = roomPresetUpdate ? 'none' : value
        roomEffect.textContent = roomPresetUpdate ? value : 'none'

        this.elements.presetSelection.textContent = value

        roomList.style.display = 'none'
        convolverList.style.display = 'none'
    }

    async saveSelection() {
        await this._store.saveReverb(this.elements.presetSelection.textContent)
    }

    setValuesToNone() {
        const { presetSelection, roomEffect, convolverEffect } = this.elements
        presetSelection.textContent = 'none'
        roomEffect.textContent = 'none'
        convolverEffect.textContent = 'none'
    }

    async clearReverb() {
        this.setValuesToNone()
        await this.saveSelection()
        await this._reverb.setReverbEffect('none')
    }
}
