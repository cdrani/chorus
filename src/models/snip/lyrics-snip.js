import Dispatcher from '../../events/dispatcher.js'
import { currentData } from '../../data/current.js'

import Alert from '../alert.js'
import { currentSongInfo } from '../../utils/song.js'
import { parseNodeString } from '../../utils/parser.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

class LyricsSnip {
    constructor() { 
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
    get #lyricsSaveBtn() { return document.getElementById('lyrics-save')}
    get #lyricsWrapper() { return document.querySelector('main > div > div > div') }

    #setupButtonEvents() {
        this.#lyricsSaveBtn.addEventListener('click', this.#saveSnip)
        this.#lyricsShareBtn?.addEventListener('click', this.#shareSnip)
    }

    #warningMessage() {
        this._alert.displayAlert({ type: 'danger', message: 'Highlight lyrics to share or save.' })
    }

    #saveSnip = async () => {
        if (!Object.keys(this._selectionTimes).length) return this.#warningMessage()
        
        const { startTime, endTime } = this._selectionTimes
        await this._snip._snipSave.save({ id: currentSongInfo().id, startTime, endTime })
    }

    #shareSnip = async () => {
        if (!Object.keys(this._selectionTimes).length) return this.#warningMessage()
           
        const { startTime, endTime } = this._selectionTimes
        await this._snip.snipSave.share({ startTime, endTime })
    }

    #setupHighlightListener = () => {
        this.#lyricsWrapper?.addEventListener('mouseup', async () => await this.#handleHighlight()) 
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
            detail: { key: 'lyrics.stamps', values: { track_id: currentSongInfo().track_id } }
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

    toggleUI(show) {
        if (!this.#lyricsUI) this.#createUI()

        this.#lyricsUI.style.display = (show || this.#lyricsAvailable) ? 'flex' : 'none'
        if (show || this.#lyricsAvailable) this.#setupHighlightListener()
        this.#resetSelectionTimes()
    }
    
    #createUI() {
        const ui = parseNodeString(`
            <div id="lyrics-ui">
                <button id="lyrics-share" class="share chorus-text-button"><span>share</span></button>
                <button id="lyrics-save" class="success chorus-text-button"><span>save</span></button>
            </div>
        `)
        document.body.appendChild(ui)
    }

    #disableLyricsButtons(disable) {
        this.#lyricsSaveBtn.disabled = disable
        this.#lyricsShareBtn.disabled = disable
    }

    removeUI() { document.getElementById('lyrics-ui').remove() }
}

export const lyricsSnip = new LyricsSnip()
