import { highlightIconTimer } from '../utils/highlight.js'

export default class HeartIcon {
    constructor(type = 'current') {
        this._type = type
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
