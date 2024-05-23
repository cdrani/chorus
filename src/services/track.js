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
        } catch (error) {
            reject(error)
        }
    })
}

// ids must must be comma-separated of spotify ids. Ex. ids=jksfdlkjd,jfdklkfdsj,lsuouw
export function checkIfTracksInCollection({ ids }) {
    return new Promise(async (resolve, reject) => {
        try {
            const options = await setOptions({ method: 'GET' })

            const url = `${API_URL}/contains?ids=${ids}`
            const response = await request({ url, options })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
