class TrackListObserver {
    #skip
    #observer
    #isHidden = true

    constructor(skip) {
        this.#skip = skip
        this.#skip.setUpBlocking()

        this.observe()
    }

    observe() {
        this.#showUI()

        const target = document.querySelector('main')
        this.#observer = new MutationObserver(this.#mutationHandler)
        this.#observer.observe(target, { subtree: true, childList: true, })
    }

    #isQueueView(mutation) {
        if (mutation.target.localName !== 'main') return false
        if (!mutation.addedNodes.length) return false

        const addedNode = Array.from(mutation.addedNodes)?.at(0)
        if (addedNode.localName != 'section') return false
        
        return true
    }

    #isMainView(mutation) {
        if (mutation.target.localName !== 'div') return false
        if (!mutation.addedNodes.length) return false

        const addedNode = Array.from(mutation.addedNodes)?.at(0)
        if (addedNode.localName != 'div') return false

        const classList = Array.from(mutation.target.classList)
        if (!classList.includes('main-view-container__mh-footer-container')) return false

        return true
    }

    #isMoreLoaded(mutation) {
        const { target } = mutation
        return target?.role == 'presentation' &&
            mutation.addedNodes.length >= 1
    }

    #mutationHandler = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (this.#isQueueView || this.#isMainView(mutation) || this.#isMoreLoaded(mutation)) {
                this.#isHidden ? this.#skip.removeBlocking() : this.#skip.setUpBlocking()         
            }
        }
    }

    #hideUI() {
        this.#isHidden = true
        this.#skip.removeBlocking()
    }

    #showUI() {
        this.#isHidden = false
        this.#skip.setUpBlocking()
    }

    disconnect() {
        this.#hideUI()

        this.#observer?.disconnect()
        this.#observer = null
    }
}
