import { getState } from '../utils/state.js'
import { makeRequest, handleRequest } from './api.js'

function playSharedTrack({ track_id, position = 0 }) {
    return handleRequest(async () => {
        const body = {
            uris: [`spotify:track:${track_id}`],
            position_ms: Math.max(parseInt(position, 10), 0) * 1000,
        }
        const device_id = await getState('device_id')
        const endpoint = `/play?device_id=${device_id}`
        return await makeRequest({ endpoint, type: 'player', params: { method: 'PUT', body } })
    })
}


function seekTrackToPosition({ position = 0 }) {
    return handleRequest(async () => {
        const device_id = await getState('device_id')
        const endpoint = `/seek?position_ms=${position}&device_id=${device_id}`
        return await makeRequest({ endpoint, type: 'player', params: { method: 'PUT' } })
    })
}

function getQueue() {
    return handleRequest(async () => (
       await makeRequest({ endpoint: '/queue', type: 'player', params: { method: 'GET' } })
    ))
}

export { playSharedTrack, seekTrackToPosition, getQueue }
