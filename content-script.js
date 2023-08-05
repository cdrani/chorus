const loadScript = filePath => {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL(filePath)
    script.type = 'module'
    document.body.appendChild(script)
}

loadScript('actions/init.js')

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
