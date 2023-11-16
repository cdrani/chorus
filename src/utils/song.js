import { timeToSeconds } from './time.js'

export const currentSongInfo = () => {
    const songLabel = document.querySelector('[data-testid="now-playing-widget"]')?.getAttribute('aria-label')
    const image = document.querySelector('[data-testid="CoverSlotCollapsed__container"] img')
    const anchor = document.querySelector('[data-testid="CoverSlotCollapsed__container"] a')
    const contextType = anchor?.getAttribute('data-context-item-type')

    // Remove 'Now playing: ' prefix
    const id = songLabel?.split('Now playing: ')?.at(1)

    if (!contextType) return { id, cover: image?.src }

    const params = new URLSearchParams(anchor?.href)
    const trackId = params?.get('uri')?.split(`${contextType}:`).at(1)

    return  {
        id,
        cover: image?.src,
        ...contextType && {
            type: contextType,
            trackId, 
            url: `${location.origin}/${contextType}/${trackId}`,
        }
    }

}

export const trackSongInfo = row => {
    const title = row?.querySelector('a > div')?.textContent || 
        row?.querySelector('div[data-encore-id="type"]')?.textContent
    const songLength = row?.querySelector('button[data-testid="add-button"] + div')?.textContent
    const image = row?.querySelector('img')

    if (!songLength) return

    const artists = getArtists(row)
    const trackInfo = getTrackId(row)

    return {
        title,
        startTime: 0,
        cover: image?.src,
        artists: getArtists(row),
        id: `${title} by ${artists}`,
        endTime: timeToSeconds(songLength),
        ...trackInfo && {...trackInfo }
    }
}    

const getTrackId = row => {
    const trackIdUrl = row.querySelector('a[data-testid="internal-track-link"]')?.href
    if (!trackIdUrl) return

    const url = trackIdUrl.split('.com').at(1)
    return {
        url,
        trackId: url.split('/').at(2)
    }
}

const getArtists = row => {
    const artistsList = row.querySelectorAll('span > div > a')
    // Here means we are at artist page and can get name from h1
    if (!artistsList.length) return document.querySelector('span[data-testid="entityTitle"] > h1').textContent

    return Array.from(artistsList).filter(artist => artist.href.includes('artist')).map(artist => artist.textContent).join(', ')
}
