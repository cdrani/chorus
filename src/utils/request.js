import { getState } from './state.js'

export const setOptions = async ({ method = 'GET', body = null }) => {
    const authHeader = await getAuthHeader()
    return {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    }
}

const getAuthHeader = async () => {
    const authHeader = await getState('auth_token')
    return authHeader
}

export const request = async ({ url, options, cb = null }) => {
    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        if (response?.status !== 204) {
            const jsonResponse = await response?.json()
            return jsonResponse
        }
    } catch (error) { throw error } 
    finally { if (cb) await cb() }
}
