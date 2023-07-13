const loadScripts = scripts => {
    scripts.forEach(script => {
        const s = document.createElement('script')
        s.src = chrome.runtime.getURL(script)
        document.body.appendChild(s)
    })
}

// scripts MUST be loaded in order!
const scripts = [
    'actions/overload.js',
    'utils/time.js',
    'utils/playback.js',
    'components/buttons.js',
    'components/header.js',
    'components/labels.js',
    'components/slider.js',
    'components/snip-controls.js',
    'models/video.js',
    'models/icon.js',
    'models/slider/slider-controls.js',
    'models/slider/slider-inputs.js',
    'models/slider/slider.js',
    'models/snip/snip.js',
    'models/snip/snip-controls.js',
    'events/dispatcher.js',
    'events/listeners.js',
    'stores/cache.js',
    'stores/data.js',
    'actions/main.js',
    'models/skip.js',
    'observers/track-list.js',
    'observers/current-time.js',
    'observers/now-playing.js',
    'actions/init.js',
]

loadScripts(scripts)

const sendEvent = ({ eventType, detail }) => {
    document.dispatchEvent(new CustomEvent(eventType, { detail }))
}

document.addEventListener('storage.set', async e => {
    const { key, values } = e.detail
    const response = await setState({ key, values })
    sendEvent({ eventType: 'storage.set.response', detail: response })
})

document.addEventListener('storage.get', async e => {
    const response = await getState(e.detail)
    sendEvent({ eventType: 'storage.get.response', detail: response })
})

document.addEventListener('storage.delete', async e => {
    const response = await removeState(e.detail.key)
    sendEvent({ eventType: 'storage.delete.response', detail: response })
})

document.addEventListener('storage.populate', async () => {
    const response = await getState(null)
    sendEvent({ eventType: 'storage.populate.response', detail: response })
})

chrome.runtime.onMessage.addListener(message => {
    sendEvent({ eventType: 'app.enabled', detail: { enabled: message.enabled } })
})
