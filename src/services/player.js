import { setOptions, request } from '../utils/request.js'

const API_URL = 'https://api.spotify.com/v1/me/player/'
const QUERY = { play: 'play', seek: 'seek?position_ms=' }

const generateURL = ({ type, value }) => {
    const queryString = `${QUERY[type]}${type == 'play' ? '' : value}`
    const deviceId = JSON.parse(sessionStorage.getItem('device_id'))
    const deviceIdString = !deviceId ? '' : `${value && type != 'play' ? '&' : '?'}device_id=${deviceId}`
    return `${API_URL}${queryString}` + deviceIdString
}

export const PlayerService = {
    seekTo: async ({ position, cb }) => {
        const url = generateURL({ type: 'seek', value: position })
        const options = setOptions({ method: 'PUT' })
        await request({ url, options, cb })
    },
    play: async ({ trackId, position, cb }) => {
        const url = generateURL({ type: 'play' })
        const body = {
            ...trackId && { uris: [`spotify:track:${trackId}`] }, 
            position_ms: Math.max(parseInt(position, 10), 0) * 1000,
        }
        const options = setOptions({ method: 'PUT', body })
        await request({ url, options, cb })
    }
}
