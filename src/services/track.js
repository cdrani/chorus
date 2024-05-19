import { setOptions, request } from '../utils/request.js'

const API_URL = 'https://api.spotify.com/v1/me/tracks'

// !! method must be either PUT or DELETE !!
export function updateLikedTracks({ id, method }) {
    return new Promise(async (resolve, reject) => {
        try {
            const body = { ids: [id] }
            const options = await setOptions({ method, body })
            
            const response = await request({ url: API_URL, options })
            resolve(response)
        } catch(error) { reject(error) }
    })
}
