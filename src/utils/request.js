const API_URL = 'https://api.spotify.com/v1/me/player/'

const setOptions = ({ type, value }) => ({
    method: type == 'next' ? 'POST' : 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('auth_token'),
    },
    body: type == 'play' ? JSON.stringify({ "position_ms": value }) : null
})

const QUERY = {
    next: 'next',
    play: 'play',
    seek: 'seek?position_ms=',
}

const generateURL = ({ type, value }) => {
    const queryString = `${QUERY[type]}${type == 'play' ? '' : value}`
    const deviceId = JSON.parse(sessionStorage.getItem('device_id'))
    const deviceIdString = !deviceId ? '' : `${value && type != 'play' ? '&' : '?'}device_id=${deviceId}`
    return `${API_URL}${queryString}` + deviceIdString
}

export const request = async ({ type = 'seek', value = '', cb = null }) => {
    const URL = generateURL({ type, value })

    try {
        const response = await fetch(URL, setOptions({ type, value }))

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        if (cb) await cb()
    } catch (error) {
        console.error('Problem with data request: ', error)
        throw error
    }
}
