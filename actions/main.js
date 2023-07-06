class Main {
    constructor({ snip, listener }) {
        this._snip = snip
        this._listener = listener
        this._mainElement = document.getElementById('chorus-main')
    }

    init() {
        this._insertIntoDOM()
    }

    get element() {
        return this._mainElement
    }

    get _isBlock() {
        if (!this?._mainElement) return false

        return this._mainElement.style.display === 'block'
    }

    get _hasControls() {
        const snipControls = document.getElementById('chorus-snip-controls')

        return !!snipControls
    }

    _insertIntoDOM() {
        if (this._hasControls) return

        const snipControls = createSnipControls({
            current: playback.current(),
            duration: playback.duration(),
        })
        this._mainElement.insertAdjacentHTML('beforeend', snipControls)
    }

    _hide() {
        if (!this?._mainElement) return

        this._mainElement.style.display = 'none'
    }

    _show() {
        this._insertIntoDOM()
        this._mainElement.style.display = 'block'

        this._snip.init()
        this._listener.listen()
    }

    toggler() {
        this._isBlock ? this._hide() : this._show()
    }
}
