const stateResolver = ({ resolve, reject, result, key, values }) => {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (key) return resolve(result?.[key])
    if (values) return resolve(values)

    return resolve(result)
}

export const getState = key => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, result => {
            return stateResolver({ key, resolve, reject, result })
        })
    })
}

export const removeState = key => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, result => {
            return stateResolver({ key, resolve, reject, result })
        })
    })
}

export const setState = ({ key, values }) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: values }, result => {
            return stateResolver({ resolve, reject, result, values })
        })
    })
}
