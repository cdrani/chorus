import { setOptions, request } from '../utils/request.js'

const API_URL = 'https://api.spotify.com/v1/me/player/'
const QUERY = { play: 'play' }

const generateURL = ({ type, value = '' }) => {
    const queryString = `${QUERY[type]}${type == 'play' ? '' : value}`
    const deviceId = JSON.parse(sessionStorage.getItem('device_id'))
    const deviceIdString = !deviceId ? '' : `${value && type != 'play' ? '&' : '?'}device_id=${deviceId}`
    return `${API_URL}${queryString}` + deviceIdString
}

export const PlayerService = {
    play: async ({ position, trackId, cb }) => {
        const body = {
            uris: [`spotify:track:${trackId}`],
            position_ms: Math.max(parseInt(position, 10), 0) * 1000,
        }
        const options = await setOptions({ method: 'PUT', body })
        await request({ url: generateURL({ type: 'play'}), options, cb })
    }
}
