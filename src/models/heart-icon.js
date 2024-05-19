import { parseNodeString } from '../utils/parser.js'
import { highlightIconTimer } from '../utils/highlight.js'

import { createIcon, HEART_ICON } from '../components/icons/icon.js'

export default class HeartIcon {
    constructor(type = 'current') {
        this._type = type
    }

    init() { this.#placeIcon(); this.#setupListener(); }

    removeIcon() {
        this.#heartIcon?.remove()
    }

    #placeIcon() {
        const refNode = document.querySelector('[data-testid="now-playing-widget"] > button')
        const heartButton = parseNodeString(this.#createHeartIcon)
        refNode.parentElement.insertBefore(heartButton, refNode)
    }


    get #createHeartIcon() {
        return createIcon(HEART_ICON)
    }

    get #heartIcon() {
        return document.querySelector('#chorus-heart')
    }

    #setupListener() {
        this.#heartIcon?.addEventListener('click', () => {})
    }

    get isCurrent() {
        return this._type == 'current'
    }

    get icon() {
        const selector = this.isCurrent ? '#chorus-heart' : ''
        return document.querySelector(selector)
    }

    get nowPlayingButton() {
        return document.querySelector('div[data-testid="now-playing-widget"] > button')
    }

    get isHighlighted() {
        const button = this.nowPlayingButton
        if (!button) return false
        return JSON.parse(button.getAttribute('aria-checked'))
    }

    highlightIcon() {
        highlightIconTimer({ 
            fill: true,
            highlight: this.isHighlighted,
            selector: '#chorus-heart > svg',
        })
    }
     
}
