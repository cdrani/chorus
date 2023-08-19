export default class Discography {
    constructor() {

    }

    init() {

    }

    get #isDiscography() {
        return location.pathname.includes('discography')
    }

    get #isSingles() {
        return location.pathname.endsWith('single')
    }

    get #isAlbums() {
        return location.pathname.endsWith('album')
    }

    get #artist() {
        const artist = document.querySelector('main')?.ariaLabel
        return artist?.split(' - ')?.at(0)
    }

    get #albums() {
        const albumGrid = Array.from(
            document.querySelectorAll(
                'div.contentSpacing[data-testid="grid-container"] > div'
            )
        )

        const albums = albumGrid.map(album => {
            const anchor = album.querySelector('a')
            const year = album.querySelector('time')

            return {
                url: anchor.href,
                year: year.textContent,
                name: anchor.firstChild.textContent, 
                state: 'unplayed' // unplayed, playing, played
            }
        })

        return albums 
    }

    async read(artist = undefined) {
        return await this.#store.getDisco({ key: artist ?? this.#artist })
    }

    async update({ artist, data }) {
        const { currentAlbum, currentTrack } = await this.read(artist)

        // TODO: need to be able to mark the state of album
    
        await this.#store.saveDisco({
            key: artist,
            value: {
                ...data,
                currentTrack: data.currentTrack || currentTrack,
                currentAlbum: data.currentAlbum || currentAlbum,
            }
        })
    }

    async save() {
        await this.#store.saveDisco({
            key: this.#artist,
            value: {
                artist: this.#artist,
                currentTrack: null,
                type: this.isSingle ? 'singles' : 'albums',
                ...this.#isAlbums && { albums: this.#albums }
            }
        })
    }

    async remove() {
        await this.#store.removeDisco({ key: this.#artist })
    }
}
