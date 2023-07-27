export default class CacheStore {
    #cache
    constructor() {
        this.#cache = sessionStorage
    }

    getKey(key) {
        return JSON.parse(this.#cache.getItem(key))
    }

    getValue({ key, value }) {
        const result = this.getKey(key)
        if (!result) {
            this.update({ key, value })
        }

        return this.getKey(key)
    }

    update({ key, value }) {
        if (value?.error) return

        const parsedValue = typeof value !== 'string' ? JSON.stringify(value) : value
        this.#cache.setItem(key, parsedValue || {})
    }

    removeKey(key) {
        if (!this.getKey(key)) return

        this.#cache.removeItem(key)
    }
}
