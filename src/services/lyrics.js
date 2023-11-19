import { request, setOptions } from '../utils/request.js'

const BASE_PATH = 'https://spclient.wg.spotify.com/color-lyrics/v2/track'

function getLyricsTimeStamps({ track_id }) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `${BASE_PATH}/${track_id}?format=json`
            const options = await setOptions({ includePlatform: true })
            const response = await request({ url, options })

            resolve(response)
        } catch(error) { reject(error) }
    })
}

export { getLyricsTimeStamps }
