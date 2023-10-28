let ENABLED = true
let popupPort = null

chrome.runtime.onConnect.addListener(port => {
    if (port.name !== 'popup') return

    popupPort = port
    port.onDisconnect.addListener(() => (popupPort = null))
})

function setBadgeInfo(enabled = true) {
    chrome.action.setBadgeText({ text: enabled ? 'on' : 'off' })
    chrome.action.setBadgeTextColor({ color: 'white' })
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#1ed760' : 'gray' })
}

chrome.runtime.onInstalled.addListener(async () => {
    const result = await setState({ key: 'enabled', value: true })

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

function getState(key) {
    return new Promise((resolve, reject) => (
        chrome.storage.local.get(key, result => stateResolver({ key, resolve, reject, result }))
    ))
}

function setState({ key, value = {} }) {
    return new Promise((resolve, reject) => (
        chrome.storage.local.set({ [key]: value }, result => stateResolver({ resolve, reject, result }))
    ))
}

chrome.storage.onChanged.addListener(async changes => {
    const keys = Object.keys(changes)
    const changedKey = keys.find(key => (
        key == 'now-playing' || key == 'enabled' || key == 'auth_token' || key == 'device_id'
    ))

    if (!changedKey) return

    if (changedKey == 'now-playing' && ENABLED) {
        return popupPort?.postMessage({ type: changedKey, data: changes[changedKey].newValue }) 
    }

    if (changedKey == 'enabled') {
        const { newValue } = changes.enabled
        ENABLED = newValue
        setBadgeInfo(newValue)
    }

    await sendMessage({ message: { [changedKey]: changes[changedKey].newValue }})
})

async function getActiveTab() {
    const result = await chrome.tabs.query({ url: ['*://open.spotify.com/*'] })
    return result?.at(0)
}

function messenger({ tabId, message }) {
    return new Promise((reject, resolve) => {
        chrome.tabs.sendMessage(tabId, message, response => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}

async function sendMessage({ message }) {
    const activeTab = await getActiveTab()
    if (!activeTab) return

    return await messenger({ tabId: activeTab.id, message })
}

chrome.webRequest.onBeforeRequest.addListener(details => {
    const rawBody = details?.requestBody?.raw?.at(0)?.bytes
    if (!rawBody) return

    // Decoding the ArrayBuffer to a UTF-8 string
    const text = new TextDecoder('utf-8').decode(new Uint8Array(rawBody))
    const data = JSON.parse(text)
    chrome.storage.local.set({ device_id: data.device.device_id.toString() })
},
    { urls: ['https://guc3-spclient.spotify.com/track-playback/v1/devices'] },
    ['requestBody']
)

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    const authHeader = details?.requestHeaders?.find(header => header?.name == 'authorization')
    if (!authHeader) return

    chrome.storage.local.set({ auth_token: authHeader?.value })
},
    { 
        urls: [
            'https://api.spotify.com/*',
            'https://guc3-spclient.spotify.com/track-playback/v1/devices'
        ]
    },
    ['requestHeaders']
)

chrome.commands.onCommand.addListener(async command => {
    const tab = await getActiveTab()
    if (!tab) return

    const chorusMap = {
        'settings': '#chorus-icon',
        'block-track': '#chorus-skip',
        'seek-rewind': '#seek-player-rw-button',
        'seek-fastforward': '#seek-player-ff-button',
    }

    const mediaMap = {
        'repeat': '[data-testid="control-button-repeat"]',
        'shuffle': '[data-testid="control-button-shuffle"]',
        'next': '[data-testid="control-button-skip-forward"]',
        'previous': '[data-testid="control-button-skip-back"]',
        'play/pause': '[data-testid="control-button-playpause"]',
        'mute/unmute': '[data-testid="volume-bar-toggle-mute-button"]',
        'save/unsave': '[data-testid="now-playing-widget"] > [data-testid="add-button"]',
    }

    if (command == 'on/off') {
        const enabled = await getState('enabled')        
        chrome.storage.local.set({ enabled: !enabled })
        return
    } 

    const selector = chorusMap[command] || mediaMap[command]
    const isChorusCommand = Object.keys(chorusMap).includes(command)

    if (!ENABLED && isChorusCommand) return

    await chrome.scripting.executeScript({
        args: [selector],
        target: { tabId: tab.id },
        func: selector => document.querySelector(selector)?.click(),
    })
})
