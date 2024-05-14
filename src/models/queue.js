import { currentData } from '../data/current'

export default class Queue {
    constructor() {}

    get addedToQueue() {
        return document.querySelector('[aria-label="Next in queue"]')
    }

    get nextInQueue() {
        return document.querySelector('[aria-label="Next up"]')
    }

    get blockedTracks() {
        return currentData.blockedTracks
    }
}
