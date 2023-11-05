import { store } from '../stores/data.js'
import { spotifyVideo } from './overload.js'

import App from '../models/app.js'

const setup = setInterval(async () => {
    const video = spotifyVideo.element
    const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"]')
    if (!video) return
    if (!nowPlayingWidget) return

    await load()
    clearInterval(setup)
}, 500)

async function load() {
    await store.populate()
    const app = new App(spotifyVideo.element)
    const enabled = JSON.parse(sessionStorage.getItem('enabled') ?? 'true')
    
    enabled ? await app.connect() : app.disconnect()
    spotifyVideo.element.active = enabled

    document.addEventListener('app.enabled', async e => {
        const { enabled } = e.detail

        const currentlyEnabled = sessionStorage.getItem('enabled') ?? 'true'
        if (enabled.newValue == JSON.parse(currentlyEnabled)) return

        sessionStorage.setItem('enabled', enabled.newValue)
        spotifyVideo.element.active = enabled.newValue
        enabled.newValue ? await app.connect() : app.disconnect()
    })

    document.addEventListener('app.device_id', async e => {
        const { device_id } = e.detail
        sessionStorage.setItem('device_id', device_id)
    })

    document.addEventListener('app.auth_token', async e => {
        const { auth_token } = e.detail
        sessionStorage.setItem('auth_token', auth_token)
    })
}
