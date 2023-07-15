class NowPlayingObserver {
    constructor(snip) {
        this._snip = snip
        this._observer = null

        this.observe()
    }

    observe() {
        const target = document.querySelector('[data-testid="now-playing-widget"]')
        const config = { subtree: true, childList: true, attributes: true }

        this._observer = new MutationObserver(this._handler)
        this._observer.observe(target, config)
    }

    _isAnchor(mutation) {
        return (
            mutation.type === 'attributes' &&
            mutation.target.nodeName == 'A' &&
            mutation.attributeName === 'href'
        )
    }

    _handler = mutationsList => {
        for (const mutation of mutationsList) {
            if (this._isAnchor(mutation)) {
                this._snip.updateView()
            }
        }
    }

    disconnect() {
        this._observer?.disconnect()
    }
}
