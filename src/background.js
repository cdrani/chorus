import { setState, getState } from './utils/state.js'
import { getActiveTab, sendMessage } from './utils/messaging.js'

import { createArtistDiscoPlaylist } from './services/artist-disco.js'
import { playSharedTrack, seekTrackToPosition } from './services/player.js'

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
    const result = await setState({ key: 'enabled', values: true })
    if (!result?.error) setBadgeInfo(true)
})

function updateBadgeState({ changes, changedKey }) {
    if (changedKey != 'enabled') return

    const { newValue, oldValue } = changes.enabled
    ENABLED = newValue ?? !oldValue
    setBadgeInfo(ENABLED)
}

chrome.storage.onChanged.addListener(changes => {
    const keys = Object.keys(changes)
    const changedKey = keys.find(key => (
        ['now-playing', 'enabled', 'auth_token', 'device_id'].includes(key)
    ))

    if (!changedKey) return

    updateBadgeState({ changes, changedKey })

    if (changedKey == 'now-playing' && ENABLED) {
        return popupPort?.postMessage({ type: changedKey, data: changes[changedKey].newValue }) 
    }

    const messageValue = changedKey == 'enabled' ? changes[changedKey] : changes[changedKey].newValue
    sendMessage({ message: { [changedKey]: messageValue }})
})

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

function promiseHandler(promise, sendResponse) {
    promise.then(result => sendResponse({ state: 'completed', data: result }))
          .catch(error => sendResponse({ state: 'error', error: error.message }))
}

chrome.runtime.onMessage.addListener(({ key, values }, _, sendResponse) => {
    const messageHandler = {
        'play.shared': playSharedTrack,
        'play.seek': seekTrackToPosition,
        'artist-disco': createArtistDiscoPlaylist,
    }
    const handlerFn = messageHandler[key]
    if (!handlerFn) return

    promiseHandler(handlerFn(values), sendResponse)
    return true
})

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
