import { createAlert } from '../components/alert.js'
import { parseNodeString } from '../utils/parser.js'

export default class Alert {
    constructor() {
        this.init()
    }

    init() {
        this.#setupAlert()
    }

    #handleAlert({ e, target }) {
        e.stopPropagation()
        const container = target.parentElement
        container.style.display = 'none'
    }

    #setupAlert() {
        const alertEl = parseNodeString(createAlert())
        document.body.appendChild(alertEl) 

        const closeAlertButton = document.getElementById('chorus-alert-close-button')
        closeAlertButton?.addEventListener('click', (e) =>  { 
            this.#handleAlert({ e, target: closeAlertButton })
        })
    }
}
