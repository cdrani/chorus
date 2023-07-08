class CurrentTimeObserver {
    constructor({ video, snip }) {
        this._snip = snip
        this._video = video
        this._observer = null

        this.observe()
    }

    observe() {
        const target = document.querySelector('[data-testid="playback-position"]')
        this._observer = new MutationObserver(this._handler)
        this._observer.observe(target, { childList: true, subtree: true, characterData: true })
    }

    disconnect() {
        this._observer?.disconnect()
    }

    _handler = mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'characterData' && mutation.target.data) {
                const targetTime = mutation.target.data

                const { startTime, endTime, isSnip } = this._snip.read()
                const repeatButton = document.querySelector('[data-testid="control-button-repeat"]')
                const isLooping = repeatButton?.ariaLabel === 'Disable repeat'
                const nextButton = document.querySelector(
                    '[data-testid="control-button-skip-forward"]'
                )

                const atEnd = Boolean(isSnip) && endTime && secondsToTime(endTime) === targetTime
                const loopAtEnd = atEnd && isLooping

                if (atEnd) {
                    if (loopAtEnd) {
                        this._video.currentTime = startTime
                    } else {
                        nextButton.click()
                    }
                }
            }
        }
    }
}
