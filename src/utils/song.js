import { timeToSeconds } from './time.js'

export const getTrackId = () => {
    const { track_id } = currentSongInfo()
    if (track_id) return track_id

    const nowPlaying = sessionStorage.getItem('now-playing') 
    if (!nowPlaying) return // TODO: look into perhaps getting track id from web api based on album id?

    return JSON.parse(nowPlaying).track_id
}

export const currentSongInfo = () => {
    const songLabel = document.querySelector('[data-testid="now-playing-widget"]')?.getAttribute('aria-label')
    const image = document.querySelector('[data-testid="CoverSlotCollapsed__container"] img')
    const anchor = document.querySelector('[data-testid="CoverSlotCollapsed__container"] a')
    const contextType = anchor?.getAttribute('data-context-item-type')

    // Remove 'Now playing: ' prefix
    const id = songLabel?.split('Now playing: ')?.at(1)

    const params = new URLSearchParams(anchor?.href)
    const contextTypeId = params?.get('uri')?.split(`${contextType}:`).at(1)
    const contextTypeIdFromHead = document.querySelector('link[rel="canonical"]')
        ?.href?.split(`${contextType ?? 'track'}/`)?.at(-1)

    const track_id = contextTypeId ?? contextTypeIdFromHead
    const type = contextType ?? 'track'
    const url = `${location.origin}/${type}/${track_id}`
    return  { id, type, cover: image?.src, track_id, url }
}

export const trackSongInfo = row => {
    const title = row?.querySelector('a > div')?.textContent || 
        row?.querySelector('div[data-encore-id="type"]')?.textContent
    const songLength = row?.querySelector('button[data-testid="add-button"] + div')?.textContent
    const image = row?.querySelector('img')

    if (!songLength) return

    const artists = getArtists(row)
    const trackInfo = getTrackIdFromRow(row)

    return {
        title,
        startTime: 0,
        cover: image?.src,
        artists: getArtists(row),
        id: `${title} by ${artists}`,
        endTime: timeToSeconds(songLength),
        ...trackInfo, 
    }
}    

const getTrackIdFromRow = row => {
    const trackIdUrl = row.querySelector('a[data-testid="internal-track-link"]')?.href
    if (!trackIdUrl) return {}

    const url = trackIdUrl.split('.com').at(1)
    return { url, track_id: url.split('/').at(2) }
}

const getArtists = row => {
    const artistsList = row.querySelectorAll('span > div > a')
    // Here means we are at artist page and can get name from h1
    if (!artistsList?.length) { 
        return document.querySelector('span[data-testid="entityTitle"] > h1')?.textContent || ''
    }

    return Array.from(artistsList).filter(artist => artist.href.includes('artist')).map(artist => artist.textContent).join(', ')
}
