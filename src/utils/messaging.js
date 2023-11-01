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

function sendBackgroundMessage(message){
    return new Promise((reject, resolve) => {
        chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}

export { sendMessage, sendBackgroundMessage, getActiveTab }
