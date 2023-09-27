import { currentData } from '../../data/current.js'

export default class VideoOverride {
    constructor(video) {
        this._video = video
        this.#overrideMediaProperty('currentTime', this.#handleCurrentTimeSetting)
        this.#overrideMediaProperty('playbackRate', this.#handlePlaybackRateSetting)
    }

    async #overrideMediaProperty(propertyName, handler) {
        const self = this

        const descriptor = Object.getOwnPropertyDescriptor(
            HTMLMediaElement.prototype,
            propertyName
        )

        if (!descriptor || descriptor._isOverridden) return

        Object.defineProperty(HTMLMediaElement.prototype, propertyName, {
            async set(value) {
                const newValue = self._video.active ? await handler.call(this, value) : value
                descriptor.set.call(this, newValue)
            },
            get: descriptor.get,
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable
        })

        Object.defineProperty(descriptor, '_isOverridden', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        })
    }

    #isValidPlaybackRate(rate) {
        const numRate = Number(rate)
        return !isNaN(numRate) && isFinite(numRate)
    }

    #handlePlaybackRateSetting = async value => {
        if (value?.source !== 'chorus') {
            if (this._video.currentSpeed) return this._video.currentSpeed

            const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
            this._video.preservesPitch = preferredPitch

            return this.#isValidPlaybackRate(preferredRate) ? preferredRate : 1
        }

        return this.#isValidPlaybackRate(value.value) ? value.value : 1
    }

    #handleCurrentTimeSetting = value => {
        return value?.value ?? value
    }
}
