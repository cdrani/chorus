import { request, setOptions } from '../utils/request.js'

const BASE_PATH = 'https://api.spotify.com/v1'

const generateURL = ({ pathType, param }) => {
    const pathName =  {
        albums: '/albums?ids=param',
        users: `/users/param/playlists`,
        playlist: `/playlists/param/tracks`,
        artists: '/artists/param/albums?limit=50',
    }

    return `${BASE_PATH}${pathName[pathType].replace('param', param)}`
}

async function fetchArtistAlbumIds(artist_id) {
    const albumIds = []
    let url = generateURL({ pathType: 'artists', param: artist_id }) 

    while (url) {
        let result = await request({ url , options: setOptions() })
        result.items.forEach(item => albumIds.push(item.id))
        url = result.next
    }

    return albumIds
}

async function fetchAlbums(albumIds) {
    const trackIds = []
    const groupSize = 20 // limit of albums can be fetched at one time

    for (let group = 0; group < albumIds.length; group += groupSize) {
        const albumIdsGroup = albumIds.slice(group, group + groupSize)
        const url = generateURL({ pathType: 'albums', param: albumIdsGroup.join(',') })
        const albumInfo = await request({ url, options: setOptions() })
        const albumGroupsTracks = albumInfo.map(({ tracks }) => tracks)

        const trackIdsInAlbumGroup = await fetchTrackURIsInAlbums(albumGroupsTracks)
        trackIds.push(trackIdsInAlbumGroup)
    }
    
    return trackIds
}

async function fetchTrackURIsInAlbums(albumTracks) {
    const trackURIs = albumTracks.reduce(async (promise, album) => {
        const trackURIs = await promise
        const albumTrackURIs = album.items.map(item => item.uri)
        trackURIs.push(...albumTrackURIs)

        let next = album.next
        while (next) {
            const tracks = await request({ url: next, options: setOptions() })
            next = tracks.next

            const trackURIsFromTracks = tracks.items.map(item => item.uri)
            trackURIs.push(...trackURIsFromTracks)
        }

        return trackURIs
    }, Promise.resolve([]))

    return trackURIs
}

async function createPlaylist({ artist_name, user_id }) {
    const url = generateURL({ pathType: 'users', param: user_id })
    const playlist = await request({ 
        url, 
        options: setOptions({ method: 'POST', body: { name: artist_name, public: false } })
    })
    return { id: playlist.id, url: playlist.external_urls.spotify }
}

async function addTracksToPlaylist({ playlist, trackURIs }) {
    const groupSize = 100 // Num. tracks that can be added to playlist at a time

    for (let group = 0; group < trackURIs.length; group += groupSize) {
        const trackURIsGroup = trackURIs.slice(group, group + groupSize)
        const url = generateURL({ pathType: 'tracks', param: playlist.id })
        const options = setOptions({ method: 'PUT', body: { uris: trackURIsGroup }})
        await request({ url, options })
    }

    let tab = (await chrome.tabs.query({ active: true, currentWindow: true })).at(0)
    chrome.tabs.update(tab.id, { url: playlist.url })
}


async function createArtistDiscoPlaylist({ artist_name, artist_id, user_id }) {
    const albumsIds = await fetchArtistAlbumIds(artist_id)
    const albums = await fetchAlbums(albumsIds)
    const trackURIs = await fetchTrackURIsInAlbums(albums)
    const playlist = await createPlaylist({ artist_name, user_id })
    await addTracksToPlaylist({ playlist, tracks: trackURIs })
}

export { createArtistDiscoPlaylist }
