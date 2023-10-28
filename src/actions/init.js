import { store } from '../stores/data.js'
import { spotifyVideo } from './overload.js'

import App from '../models/app.js'

let loaded = false
const video = spotifyVideo.element

const setup = setInterval(async () => {
    const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"]')
    if (!video && !nowPlayingWidget) return

    if (!loaded) {
        await load()
        loaded = true
    }
    clearInterval(setup)
}, 500)

async function load() {
    const video = spotifyVideo.element

    await store.populate()

    const app = new App(video)
    const enabled = JSON.parse(sessionStorage.getItem('enabled'))
    video.active = enabled
    enabled ? await app.connect() : app.disconnect()

    document.addEventListener('app.enabled', async e => {
        const { enabled } = e.detail
        
        sessionStorage.setItem('enabled', enabled)
        video.active = enabled

        enabled ? await app.connect() : app.disconnect()
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
