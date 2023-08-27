import CacheStore from "./cache.js"
import Dispatcher from "../events/dispatcher.js"

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

            if (!['enabled', 'globals'].includes(key) && !value.hasOwnProperty('isSkipped')) {
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
        const result = this.#cache.getKey(id)
        if (result && Object.hasOwn(result, 'endTime')) return result 

        return this.#cache.getValue({ key: id, value })
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
