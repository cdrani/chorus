import SeekController from './seek-controller.js'

import { store } from '../../stores/data.js'
import { currentData } from '../../data/current.js'  

export default class Seek {
    #store
    #controls

    constructor() {
        this.#store = store
        this.#controls = new SeekController()
    }

    async init() {
        const data = await currentData.getSeekValues()
        this.#controls.init(data)
    }

    get #inputValues() {
        const { rwInput, ffInput, seekCheckbox } = this.#controls.elements

        return  {
            rw: rwInput.value,
            ff: ffInput.value,
            updateShows: seekCheckbox.checked
        }
    }

    async save() {
        const { rw, ff, updateShows } = this.#inputValues
        await this.#saveSeeking({ rw, ff, updateShows })
    }

    async #saveSeeking({ rw, ff, updateShows }) {
        const { shows, global } = await currentData.getSeekValues()

        await this.#store.saveTrack({
            id: 'chorus-seek',
            value: {
                shows: {
                    ...shows,
                    ...updateShows && { rw, ff } 
                },
                global: {
                    ...global,
                    ...!updateShows && { rw, ff }
                }
            },
        })
    }
}
