import { currentData } from '../data/current.js'

export default class VideoElement {
    #video
    #active = sessionStorage.getItem('enabled') == 'true'

    constructor(video) {
        this.#video = video
        this.#listenForTrackChange()
        this.#setPlaybackRateProtection()
    }

    set active(value) {
        this.#active = value
    }

    async activate() {
        await this.#handleTrackChange()
    }

    reset() {
        this.clearCurrentSpeed()
        this.playbackRate = 1
        this.preservesPitch = true
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
        if (this.#active) {
            this.#video.playbackRate = { source: 'chorus', value: value }
        } else {
            this.#video.playbackRate = value
        }
    }

    get playbackRate() {
        return this.#video ? this.#video.playbackRate : 1
    }

    async #handleTrackChange() {
        if (!this.#active) return

        const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()

        this.currentSpeed = preferredRate
        this.#video.playbackRate = preferredRate
        this.#video.preservesPitch = preferredPitch
    }

    #listenForTrackChange() {
        this.#video.addEventListener('loadeddata', async () => {
            await this.#handleTrackChange()
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

                    const { preferredRate, preferredPitch } = await currentData.getPlaybackValues()
                    self.preservesPitch = preferredPitch

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
                        const newRate = self.#active ? await handlePlaybackRateSetting(value) : value
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
