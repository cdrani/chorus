import { getState } from './state.js'

export const setOptions = async ({ method = 'GET', body = null, connect = false }) => {
    const authHeader = await getAuthHeader()
    const connectHeader = connect ? await getConnectHeader() : null

    return {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            ...(connect && { 'X-Spotify-Connection-Id': connectHeader })
        }
    }
}

const getAuthHeader = async () => await getState('auth_token')

const getConnectHeader = async () => await getState('connection_id')

export const request = async ({ url, options }) => {
    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        if (response?.status !== 204) {
            const jsonResponse = await response?.json()
            return jsonResponse
        }
    } catch (error) {
        throw error
    }
}
