import { currentData } from '../data/current.js'

export default class VideoElement {
    #video

    constructor(video) {
        this.#video = video
        this.#listenForTrackChange()
        this.#setPlaybackRateProtection()
    }

    get element() {
        return this.#video
    }

    set currentTime(value) {
        if (this.#video) {
            this.#video.currentTime = value
        }
    }

    get currentTime() {
        return this.#video?.currentTime
    }

    clearCurrentSpeed() {
        this.#video.removeAttribute('currentSpeed') 
    }

    set preservesPitch(value) {
        if (this.#video) {
            this.#video.preservesPitch = value
        }
    }

    get currentSpeed() {
        return this.#video.getAttribute('currentSpeed')
    }

    set currentSpeed(value) {
        this.#video.setAttribute('currentSpeed', value)
    }

    get preservesPitch() {
        return this.#video ? this.#video.preservesPitch : true
    }

    set playbackRate(value) {
        if (this.#video) {
            this.#video.playbackRate = { source: 'chorus', value: value }
        }
    }

    get playbackRate() {
        return this.#video ? this.#video.playbackRate : 1
    }

    #listenForTrackChange() {
        this.#video.addEventListener('loadedmetadata', async () => {
            const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
            this.currentSpeed = preferredRate
            this.#video.playbackRate = preferredRate
            this.#video.preservesPitch = preferredPitch
        })
    }

    #setPlaybackRateProtection() {
        const self = this

        if (this.#video instanceof HTMLMediaElement) {
            const playbackRateDescriptor = Object.getOwnPropertyDescriptor(
                HTMLMediaElement.prototype,
                'playbackRate'
            )

            async function handlePlaybackRateSetting(value) {
                if (value?.source !== 'chorus') {
                    if (self.currentSpeed) return self.currentSpeed

                    const { preferredRate } = await currentData.getPlaybackValues()
                    return isValidPlaybackRate(preferredRate) ? preferredRate : 1
                }
                return isValidPlaybackRate(value.value) ? value.value : 1
            }

            function isValidPlaybackRate(rate) {
                const numRate = Number(rate)
                return !isNaN(numRate) && isFinite(numRate)
            }

            if (!playbackRateDescriptor._isOverridden) {
                Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
                    async set(value) {
                        const newRate = await handlePlaybackRateSetting(value)
                        playbackRateDescriptor.set.call(this, newRate)
                    },
                    get: playbackRateDescriptor.get,
                    enumerable: playbackRateDescriptor.enumerable,
                    configurable: playbackRateDescriptor.configurable
                })

                Object.defineProperty(playbackRateDescriptor, '_isOverridden', {
                    value: true,
                    writable: false,
                    enumerable: false,
                    configurable: false
                })
            }
        }
    }
}
