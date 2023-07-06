function setBadgeInfo(enabled = true) {
    chrome.action.setBadgeText({ text: enabled ? 'on' : 'off' })
    chrome.action.setBadgeTextColor({ color: 'white' })
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#1ed760' : 'gray' })
}

chrome.runtime.onInstalled.addListener(async () => {
    const result = await setState({
        key: 'enabled',
        value: true,
    })

    if (!result?.error) {
        setBadgeInfo(true)
        await sendMessage({ message: { enabled: true } })
    }
})

// TODO: need a way to import these functions from utils/state.js
function stateResolver({ resolve, reject, result, key }) {
    if (chrome.runtime.lastError) {
        console.error('Error: ', chrome.runtime.lastError)
        return reject({ error: chrome.runtime.lastError })
    }

    return key ? resolve(result[key]) : resolve()
}

function getState({ key = 'state' }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, result => {
            return stateResolver({ key, resolve, reject, result })
        })
    })
}

function setState({ key = 'state', value = {} }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, result => {
            return stateResolver({ resolve, reject, result })
        })
    })
}

chrome.storage.onChanged.addListener(async changes => {
    if (!changes.hasOwnProperty('enabled')) return

    const { newValue } = changes.enabled
    setBadgeInfo(newValue)
    await sendMessage({ message: { enabled: newValue } })
})

chrome.action.onClicked.addListener(async () => {
    const enabled = await getState({ key: 'enabled' })

    await setState({
        key: 'enabled',
        value: !enabled,
    })
})

async function getActiveTab() {
    const result = await chrome.tabs.query({
        active: true,
        currentWindow: true,
        url: ['*://open.spotify.com/*'],
    })

    return result?.at(0)
}

function messenger({ tabId, message }) {
    return new Promise((reject, resolve) => {
        chrome.tabs.sendMessage(tabId, message, response => {
            if (chrome.runtime.lastError) {
                return reject({ error: chrome.runtime.lastError })
            }
            return resolve(response)
        })
    })
}

async function sendMessage({ message }) {
    const activeTab = await getActiveTab()
    if (!activeTab) return

    return await messenger({ tabId: activeTab.id, message })
}
