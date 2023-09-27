import { createAlert } from '../components/alert.js'
import { parseNodeString } from '../utils/parser.js'

export default class Alert {
    displayAlert() {
        this.#setupAlert()
        const alertMessage = this.#chorusAlert.querySelector('[id="chorus-alert-message"]')

        alertMessage.textContent = `Snip copied to clipboard.`
        this.#chorusAlert.style.display = 'flex' 
        setTimeout(() => { 
            this.#chorusAlert.style.display = 'none' 
        }, 3000)
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
