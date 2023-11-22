import Alert from '../alert.js'
import Dispatcher from '../../events/dispatcher.js'

import { parseNodeString } from '../../utils/parser.js'
import { currentSongInfo, getTrackId } from '../../utils/song.js'

class LyricsSnip {
    constructor() { 
        this._isSnip = false
        this._selectionTimes = {}
        this._alert = new Alert()
        this._dispatcher = new Dispatcher()
    }

    init(snip) {
        this._snip = snip
        this.#createUI()
        this.#setupButtonEvents()
        if (this.#lyricsAvailable) this.toggleUI(true)
    }

    get #lyricsShareBtn() { return document.getElementById('lyrics-share') }
    get #lyricsDeleteBtn() { return document.getElementById('lyrics-delete')}
    get #lyricsSaveBtn() { return document.getElementById('lyrics-save')}
    get #lyricsWrapper() { return document.querySelector('main > div > div:nth-child(2)') }

    #setupButtonEvents() {
        this.#lyricsSaveBtn.addEventListener('click', this.#saveSnip)
        this.#lyricsShareBtn?.addEventListener('click', this.#shareSnip)
        this.#lyricsDeleteBtn?.addEventListener('click', this.#deleteSnip)
    }

    #warningMessage() {
        this._alert.displayAlert({ type: 'danger', message: 'Highlight lyrics to share or save.' })
    }

    set isSnip(isSnip) {
        this._isSnip = isSnip
        this.#lyricsDeleteBtn.style.display = isSnip ? 'block' : 'none'
    }

    #deleteSnip = async () => {
        const { isSnip } = await this._snip.read()
        if (isSnip) await this._snip.snipServices.delete()
        this.#lyricsDeleteBtn.style.display = 'none'
        this.isSnip = false
    }

    #saveSnip = async () => {
        if (!Object.keys(this._selectionTimes).length) return this.#warningMessage()
        
        const { startTime, endTime } = this._selectionTimes
        await this._snip.snipServices.save({ id: currentSongInfo().id, startTime, endTime })
        this.isSnip = true
    }

    #shareSnip = async () => {
        if (!Object.keys(this._selectionTimes).length) return this.#warningMessage()
           
        const { startTime, endTime } = this._selectionTimes
        await this._snip.snipServices.share({ startTime, endTime })
    }

    #setupHighlightListener = () => {
        // need to wait for ui element to appear
        setTimeout(() => { this.#lyricsWrapper?.addEventListener('mouseup', this.#handleHighlight) }, 250)
    }

    #resetSelectionTimes() { this._selectionTimes = {} }

    #handleHighlight = async () => {
        this.#resetSelectionTimes()

        const selection = window.getSelection()
        const selectedText = selection.toString().split('\n')
        if (selection.isCollapsed || !selectedText?.length) return
  
        this.#disableLyricsButtons(true)

        const startElement = selection.getRangeAt(0).startContainer.parentNode.parentNode
        const textAboveSelection = this.#getTextAboveSelection(startElement)

        await this.#getLyricsTimeStamps({ selectedText, startPoint: textAboveSelection.length })
    }

    #getTextAboveSelection(element) {
        const textContent = []
        while (element.previousSibling) {
            element = element.previousSibling
            const text = element.firstChild.textContent
            if (text) textContent.push(text)
        }
        return textContent.reverse()
    }

    async #getLyricsTimeStamps({ selectedText, startPoint }) {
        const response = await this._dispatcher.sendEvent({
            eventType: 'lyrics.stamps',
            detail: { key: 'lyrics.stamps', values: { track_id: getTrackId() } }
        })

        if (response?.error) return

        const lines = response.data.lyrics.lines.slice(startPoint, startPoint + selectedText.length + 1)
        const startTime = parseInt(lines.at(0).startTimeMs / 1000)
        const endTime = parseInt(lines.at(-1).startTimeMs / 1000)

        this._selectionTimes = { startTime, endTime }
        this.#disableLyricsButtons(false)
    }

    get #inLyricsView() { return location.pathname.endsWith('lyrics') }
    get #lyricsNotSynced() { return !!document.querySelector('main > div > div > div > p') }
    get #lyricsDoesNotExist() { return !!document.querySelector('main > div > div > span') }

    get #lyricsAvailable() {
        if (!this.#inLyricsView) return false
        if (this.#lyricsNotSynced) return false
        if (this.#lyricsDoesNotExist) return false

        return !!this.#lyricsWrapper
    }

    get #lyricsUI() { return document.getElementById('lyrics-ui') }

    toggleUI(isSnip) {
        if (!this.#lyricsUI) this.#createUI()

        this.isSnip = isSnip
        this.#lyricsUI.style.display = this.#lyricsAvailable ? 'flex' : 'none'
        if (this.#lyricsAvailable) this.#setupHighlightListener()
        this.#resetSelectionTimes()
    }
    
    #createUI() {
        const ui = parseNodeString(`
            <div id="lyrics-ui">
                <button id="lyrics-share" class="share chorus-text-button"><span>share</span></button>
                <button id="lyrics-delete" class="danger chorus-text-button"><span>delete</span></button>
                <button id="lyrics-save" class="success chorus-text-button"><span>save</span></button>
            </div>
        `)
        document.body.appendChild(ui)
    }

    #disableLyricsButtons(disable) {
        this.#lyricsSaveBtn.disabled = disable
        this.#lyricsShareBtn.disabled = disable
        this.#lyricsDeleteBtn.disabled = disable
    }

    removeUI() { document.getElementById('lyrics-ui').remove() }
}

export const lyricsSnip = new LyricsSnip()
