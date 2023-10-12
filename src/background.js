let ENABLED = true

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
    const keys = Object.keys(changes)
    const changedKey = keys.find(key => key == 'enabled' || key == 'auth_token' || key == 'device_id')

    if (!changedKey) return

    if (changedKey == 'enabled') {
        const { newValue } = changes.enabled
        ENABLED = newValue
        setBadgeInfo(newValue)
    }

    await sendMessage({ message: { [changedKey]: changes[changedKey].newValue } })
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

async function getAllSpotifyTabs() {
    const result = await chrome.tabs.query({
        url: '*://*.spotify.com/*'
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

function handleButtonClick(selector) {
    document.querySelector(selector).click()
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
    { urls: ['https://guc3-spclient.spotify.com/track-playback/v1/devices'] },
    ['requestHeaders']
)

chrome.commands.onCommand.addListener(async command => {
    if (!ENABLED) return

    const tab = await getAllSpotifyTabs()

    if (!tab) return

    const commandsMap = {
        'settings': '#chorus-icon',
        'block-track': '#chorus-skip',
        'seek-rewind': '#seek-player-rw-button',
        'seek-fastforward': '#seek-player-ff-button',
        'repeat': '[data-testid="control-button-repeat"]',
        'shuffle': '[data-testid="control-button-shuffle"]',
        'next': '[data-testid="control-button-skip-forward"]',
        'previous': '[data-testid="control-button-skip-back"]',
        'play/pause': '[data-testid="control-button-playpause"]',
        'mute/unmute': '[data-testid="volume-bar-toggle-mute-button"]',
        'save/unsave': '[data-testid="now-playing-widget"] > [data-testid="add-button"]',
    }

    const selector = commandsMap[command]
    if (!selector) return 

    await chrome.scripting.executeScript({
        args: [selector],
        func: handleButtonClick,
        target: { tabId: tab.id },
    })
})
