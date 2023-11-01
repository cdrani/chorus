import { getState } from './state.js'

export const setOptions = async ({ method = 'GET', body = null }) => {
    const authHeader = await getAuthHeader()
    return {
        method,
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    }
}

const getAuthHeader = async () => {
    if (typeof sessionStorage == 'undefined') {
        const authHeader = await getState('auth_token')
        return authHeader
    }
    
    return sessionStorage.getItem('auth_token')
}

export const request = async ({ url, options, cb = null }) => {
    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const jsonResponse = await response.json()
        return jsonResponse
    } catch (error) {
        console.error('Problem with data request: ', error)
        throw error
    } finally {
        if (cb) await cb()
    }
}
