import { store } from '../stores/data.js'

const API_URL = 'https://api.spotify.com/v1/me/player/'

const setOptions = type => ({
    method: type == 'next' ? 'POST' : 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('auth_token'),
    }
})

const ACTIONS = {
    next: 'next',
    seek: 'seek?position_ms=', // ms
    volume: 'volume?volume_percent=', // % 0 - 100
}

export const request = async ({ type = 'seek', value = '', cb = null }) => {
    const action = `${ACTIONS[type]}${value}`

    try {
        await store.refreshToken()
        const response = await fetch(`${API_URL}${action}`, setOptions(type))

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        if (cb) await cb()
    } catch (error) {
        console.error('Problem with data request: ', error)
        throw error
    }
}
