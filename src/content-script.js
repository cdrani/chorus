const loadScript = filePath => {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL(filePath)
    script.type = 'module'
    document.body.appendChild(script)
}

loadScript('actions/init.js')

const stateResolver = ({ resolve, reject, result, key, values }) => {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (key) return resolve(result?.[key])
    if (values) return resolve(values)

    return resolve(result)
}

const getState = key => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, result => {
            return stateResolver({ key, resolve, reject, result })
        })
    })
}

const removeState = key => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, result => {
            return stateResolver({ key, resolve, reject, result })
        })
    })
}

const setState = ({ key, values }) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: values }, result => {
            return stateResolver({ resolve, reject, result, values })
        })
    })
}

const sendEventToPage = ({ eventType, detail }) => {
    window.postMessage({
        type: 'FROM_CONTENT_SCRIPT',
        requestType: eventType,
        payload: detail
    }, window.location.origin)
}

window.addEventListener('message', async (event) => {
    if (event.origin !== window.location.origin) return
    if (event.data.type !== 'FROM_PAGE_SCRIPT') return

    const { requestType, payload } = event.data
    let response

    switch (requestType) {
        case 'storage.set':
            const { key, values } = payload
            response = await setState({ key, values })
            sendEventToPage({ eventType: 'storage.set.response', detail: response })
            break

        case 'storage.get':
            response = await getState(payload)
            sendEventToPage({ eventType: 'storage.get.response', detail: response })
            break

        case 'storage.delete':
            response = await removeState(payload.key)
            sendEventToPage({ eventType: 'storage.delete.response', detail: response })
            break

        case 'storage.populate':
            response = await getState(null)
            sendEventToPage({ eventType: 'storage.populate.response', detail: response })
            break
    }
})

chrome.runtime.onMessage.addListener(message => {
    sendEventToPage({ eventType: 'app.enabled', detail: { enabled: message.enabled } })
})
