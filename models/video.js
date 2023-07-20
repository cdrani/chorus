export default class VideoElement {
    #video

    constructor(video) {
        this.#video = video
    }

    get id() {
        const songName = document.querySelector('[data-testid="now-playing-widget"]')?.ariaLabel

        // Remove 'Now playing: ' prefix
        return songName?.split(': ')?.at(1)
    }

    get element() {
        return this.#video
    }

    // TODO: Don't really require these methods. The properties on the html video element
    // can be accessed using the element itself using the element getter.

    set currentTime(seconds) {
        this.#video.currentTime = seconds
    }

    get currentTime() {
        return this.#video.currentTime
    }
}
