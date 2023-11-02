import { createAlert } from '../components/alert.js'
import { parseNodeString } from '../utils/parser.js'

export default class Alert {
    displayAlert({ type = 'success', duration = 3000, message } = {}) {
        this.#setupAlert()
        const alertMessage = this.#chorusAlert.querySelector('[id="chorus-alert-message"]')
        this.#chorusAlert.style.backgroundColor = type == 'success' ? 'green' : 'red'

        
        alertMessage.textContent = message ?? 'Snip copied to clipboard.'
        this.#chorusAlert.style.display = 'flex' 
        setTimeout(() => { 
            this.#chorusAlert.style.display = 'none' 
        }, duration)
    }

    #handleAlert(target) {
        const container = target.parentElement
        container.style.display = 'none'
    }

    get #chorusAlert() {
        return document.getElementById('chorus-alert')
    }

    #setupAlert() {
        if (this.#chorusAlert) return

        const alertEl = parseNodeString(createAlert())
        document.body.appendChild(alertEl) 

        const closeAlertButton = document.getElementById('chorus-alert-close-button')
        closeAlertButton?.addEventListener('click', () =>  { 
            this.#handleAlert(closeAlertButton)
        })
    }
}
