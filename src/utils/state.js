function stateResolver({ resolve, reject, result, key, values }) {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (key) return resolve(result?.[key])
    if (values) return resolve(values)

    return resolve(result)
}

function setState({ key = 'popup-ui', value = {} }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, result => stateResolver({ resolve, reject, result }))
    })
}

function getState(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, result => stateResolver({ key, resolve, reject, result }))
    })
}

export { setState, getState }
