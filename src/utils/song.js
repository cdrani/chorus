import { timeToSeconds } from './time.js'

export const currentSongInfo = () => {
    const songLabel = document.querySelector('[data-testid="now-playing-widget"]')?.getAttribute('aria-label')
    const context = document.querySelector('[data-testid="CoverSlotCollapsed__container"] a')
    const contextType = context?.getAttribute('data-context-item-type')

    // Remove 'Now playing: ' prefix
    const id = songLabel?.split(': ')?.at(1)

    if (!contextType) return { id }

    const params = new URLSearchParams(context.href)
    const trackId = params.get('uri').split(`${contextType}:`).at(1)

    return  {
        id,
        ...contextType && {
            type: contextType,
            trackId, 
            url: `${location.origin}/${contextType}/${trackId}`
        }
    }

}

export const trackSongInfo = row => {
    const song = row?.querySelector('a > div')?.textContent || 
        row?.querySelector('div[data-encore-id="type"]')?.textContent
    const songLength = row?.querySelector('button[data-testid="add-button"] + div')?.textContent

    if (!songLength) return

    const artists = getArtists(row)
    const trackInfo = getTrackId(row)

    return {
        startTime: 0,
        id:  `${song} by ${artists}`,
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
    const artistsList = row.querySelectorAll('span > a')

    if (!artistsList.length) {
        // Here means we are at artist page and can get name from h1
        return document.querySelector('span[data-testid="entityTitle"] > h1').textContent
    }

    return Array.from(artistsList)
        .filter(artist => artist.href.includes('artist'))
        .map(artist => artist.textContent)
        .join(', ')
}
