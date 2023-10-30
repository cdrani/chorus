import CacheStore from './cache.js'
import Dispatcher from '../events/dispatcher.js'
import { currentSongInfo } from '../utils/song.js'
import { playback } from '../utils/playback.js'

const DO_NOT_INCLUDE = [ 'now-playing', 'device_id', 'auth_token', 'enabled', 'globals', 'chorus-seek']

class DataStore {
    #cache
    #dispatcher

    constructor({ cache, dispatcher }) {
        this.#cache = cache
        this.#dispatcher = dispatcher
    }

    async populate() {
        const response = await this.#dispatcher.sendEvent({
            eventType: 'storage.populate',
            detail: {},
        })

        Object.keys(response).forEach(key => {
            const value = response[key]

            if (!DO_NOT_INCLUDE.includes(key) && !value.hasOwnProperty('isSkipped')) {
                const endTime = value?.endTime
                value.isSkipped = endTime == 0
            }

            this.#cache.update({ key, value: JSON.stringify(value) })
        })
    }

    removeTrack(id) {
        this.#cache.removeKey(id)
    }

    getTrack({ id, value = {}}) {
        const cacheValue = this.#cache.getValue({ key: id, value })
        return cacheValue
    }

    async setNowPlaying(track) {
        const { id, cover } = currentSongInfo() 
        const [title, artists] = id.split(' by ')

        const duration = playback.duration()
        await this.#dispatcher.sendEvent({
            eventType: 'storage.set',
            detail: { key: 'now-playing', values: { id, title, artists, cover, duration , ...track, } },
        })

        this.#cache.update({ key: 'now-playing', value: { id, duration, title, artists, cover, ...track } })
        return this.#cache.getKey(id)    
    }

    async saveTrack({ id, value }) {
        const response = await this.#dispatcher.sendEvent({
            eventType: 'storage.set',
            detail: { key: id, values: value },
        })

        this.#cache.update({ key: id, value: response })
        return this.#cache.getKey(id)
    }

    async deleteTrack({ id, value }) {
        await this.#dispatcher.sendEvent({
            eventType: 'storage.delete',
            detail: { key: id },
        })

        this.#cache.update({ key: id, value: { ...value, isSnip: false } })
        return this.#cache.getKey(id)
    }
}

export const store = new DataStore({ cache: new CacheStore(), dispatcher: new Dispatcher() })
