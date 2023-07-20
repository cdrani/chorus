import { timeToSeconds } from './time.js'

export const songInfo = row => {
    const song = row?.querySelector('a > div')?.textContent || 
        row?.querySelector('div[data-encore-id="type"]')?.textContent
    const songLength = row?.querySelector('button[data-testid="add-button"] + div')?.textContent

    if (!songLength) return

    const artists = getArtists(row)

    return {
        id:  `${song} by ${artists}`,
        endTime: timeToSeconds(songLength)
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
