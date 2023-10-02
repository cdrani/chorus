const API_URL = 'https://api.spotify.com/v1/me/player/'

const setOptions = type => ({
    method: type == 'next' ? 'POST' : 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('auth_token'),
    }
})

const QUERY = {
    next: 'next',
    seek: 'seek?position_ms=', // ms
}

const generateURL = ({ type, value }) => {
    const queryString = `${QUERY[type]}${value}`
    const deviceId = JSON.parse(sessionStorage.getItem('device_id'))
    const deviceIdString = !deviceId ? '' : `${value ? '&' : '?'}device_id=${deviceId}`
    return `${API_URL}${queryString}` + deviceIdString
}

export const request = async ({ type = 'seek', value = '', cb = null }) => {
    const URL = generateURL({ type, value })

    try {
        const response = await fetch(URL, setOptions(type))

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        if (cb) await cb()
    } catch (error) {
        console.error('Problem with data request: ', error)
        throw error
    }
}
