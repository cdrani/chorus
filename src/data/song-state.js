import { currentData } from './current.js'
import { currentSongInfo } from '../utils/song.js'

const sharedSnipValues = () => {
    if (!location?.search) return
    
    const params = new URLSearchParams(location.search)
    const values = params?.get('ch')
    if (!values) return

    const [startTime, endTime, playbackRate, preservesPitch] = values.split('-')

    return { 
        endTime: parseInt(endTime, 10),
        startTime: parseInt(startTime, 10),
        preservesPitch: parseInt(preservesPitch, 10) == 1,
        playbackRate: parseFloat(playbackRate) / 100,
    }
}

export const songState = async () => {
    const state = await currentData.readTrack()
    const sharedSnipState = sharedSnipValues()

    const { id, track_id } = currentSongInfo()
    if (!sharedSnipState) return { ...state, id, track_id, isShared: false }

    const trackIdFromURL = location?.pathname?.split('/')?.at(-1)

    return {
        id,
        isShared: true,
        ...state,
        ...sharedSnipState,
        track_id: trackIdFromURL
    }
}
