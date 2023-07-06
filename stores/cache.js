class CacheStore {
    constructor() {
        this._cache = sessionStorage
    }

    getKey(key) {
        return JSON.parse(this._cache.getItem(key))
    }

    getValue({ key, value }) {
        const result = this._cache.getItem(key)
        if (result == null) {
            this.update({ key, value })
        }

        const refreshedValue = this._cache.getItem(key)
        return JSON.parse(refreshedValue)
    }

    update({ key, value }) {
        if (value?.error) return

        const parsedValue = typeof value !== 'string' ? JSON.stringify(value) : value
        this._cache.setItem(key, parsedValue || {})
    }

    removeKey(key) {
        if (!this._cache.getItem(key)) return

        this._cache.removeItem(key)
    }
}
