import Dispatcher from '../events/dispatcher.js'

class Queue {
    constructor() {
        this._popList = []
        this._queueList = []
        this._dispatcher = new Dispatcher()
    }
    
    get queueList() { return this._queueList }

    async #getStorage() {
        return await this._dispatcher.sendEvent({ eventType: 'storage.populate', detail: {} })
    }

    async #dispatchSetQueue() {
        return await this._dispatcher.sendEvent({
            eventType: 'play.queue',
            detail: { key: 'play.queue', values: null },
        })
    }

    // async #dispatchRecentlyPlayed() {
    //     return await this._dispatcher.sendEvent({
    //         eventType: 'play.recent',
    //         detail: { key: 'play.recent', values: null },
    //     })
    // }

    #normalizeDataItem = ({ name, id, uri, artists, storedData }) => {
        const songId = this.#getSongId({ name, artists })
        if (!songId || this._seen.has(songId)) return undefined

        this._seen.add(songId)
        const storageItem = storedData[`${songId}`]
        const defaultData = { name, id, uri, songId, isSkipped: false, startTime: 0 }

        if (!storageItem) return undefined

        const { isSkipped, startTime, endTime } = storageItem
        if (isSkipped) return undefined

        return { ...defaultData, isSkipped, startTime, endTime }
    }

    // #normalizeRecentData({ queueData, storedData }) {
    //     this._popList = queueData.map(item => item.track)
    //         .map(item => this.#normalizeDataItem({ ...item, storedData })).filter(Boolean)
    // }

    // async populate() {
    //     this._seen = new Set()
    //     const storedData = await this.#getStorage()
    //     const { error, data: { items: queueData } } = await this.#dispatchRecentlyPlayed()

    //     if (error) return

    //     this.#normalizeRecentData({ queueData, storedData })
    // }

    #getSongId({ name, artists }) {
        const artistsList = (artists || [])?.map(({ name }) => name)?.join(', ') ?? ''
        if (!artistsList) return

        return `${name} by ${artistsList}`
    }

    #normalizeQueue({ queueData, storedData }) {
        this._queueList = queueData.map(item => this.#normalizeDataItem({...item, storedData })).filter(Boolean)
    }

    async updateQueueList() {
        this._seen = new Set()
        const { error, data: { queue }} = await this.#dispatchSetQueue()
        const storedData = await this.#getStorage()

        if (error) return

        this.#normalizeQueue({ storedData, queueData: queue })
        console.log('updated q: ', this._queueList)
    }
}

export const queue = new Queue()
