class DataStore {
    constructor() {
        this._cache = new CacheStore()
        this._dispatcher = new Dispatcher()
    }

    async populate() {
        const response = await this._dispatcher.sendEvent({
            eventType: 'storage.populate',
            detail: {},
        })

        Object.keys(response).forEach(key => {
            const value = response[key]

            if (key != 'enabled' && !value.hasOwnProperty('isSkipped')) {
                value.isSkipped = false
            }

            this._cache.update({ key, value: JSON.stringify(value) })
        })
    }

    removeTrack(id) {
        this._cache.removeKey(id)
    }

    getTrack({ id, value }) {
        if (!id) return

        return this._cache.getValue({ key: id, value })
    }

    async saveTrack({ id, value }) {
        const response = await this._dispatcher.sendEvent({
            eventType: 'storage.set',
            detail: { key: id, values: value },
        })

        this._cache.update({ key: id, value: response })
        return this._cache.getKey(id)
    }

    async deleteTrack({ id, value }) {
        await this._dispatcher.sendEvent({
            eventType: 'storage.delete',
            detail: { key: id },
        })

        this._cache.update({ key: id, value })
        return this._cache.getKey(id)
    }
}
