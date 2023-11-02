async function getActiveTab() {
    const result = await chrome.tabs.query({ active: true, url: ['*://open.spotify.com/*'] })
    return result?.at(0)
}

function messenger({ tabId, message }) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, response => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}

async function sendMessage({ message }) {
    const activeTab = await getActiveTab()
    if (!activeTab) return

    messenger({ tabId: activeTab.id, message })
}

function sendBackgroundMessage(message){
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) return reject({ error: chrome.runtime.lastError })
            return resolve(response)
        })
    })
}

export { sendMessage, sendBackgroundMessage, getActiveTab }
