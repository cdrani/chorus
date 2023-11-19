import Dispatcher from '../../events/dispatcher.js'
import { currentData } from '../../data/current.js'

import Alert from '../alert.js'
import { currentSongInfo } from '../../utils/song.js'
import { parseNodeString } from '../../utils/parser.js'
import { copyToClipBoard } from '../../utils/clipboard.js'

export default class LyricSnip {
    constructor() { 
        this._active = false
        this._selectionTimes = {}

        this.#createUI()
        this.#setupButtonEvents()

        this._alert = new Alert()
        this._dispatcher = new Dispatcher()
    }

    set active(active) {
        if (!this._active || active) this.#setupListeners() 
        this._active = active
    }

    get #lyricsShareBtn() { return document.getElementById('lyrics-share') }
    get #lyricsSaveBtn() { return document.getElementById('lyrics-save')}

    get #lyricsWrapper() { return document.querySelector('main > div > div > div') }
    get #lyricsIcon() { return document.querySelector('[data-testid="lyrics-button"]') }

    #setupListeners() { 
        if (this.#lyricsAvailable) this.#handleLyricsIcon()

        this.#lyricsIcon?.addEventListener('click', this.#handleLyricsIcon) 
    }

    #setupButtonEvents() {
        this.#lyricsSaveBtn.addEventListener('click', this.#saveSnip)
        this.#lyricsShareBtn?.addEventListener('click', this.#shareSnip)
    }

    #warningMessage() {
        this._alert.displayAlert({ type: 'danger', message: 'Highlight lyrics to share or save.' })
    }

    #saveSnip = async () => {}

    #shareSnip = async () => {
        if (!Object.keys(this._selectionTimes).length) return this.#warningMessage()
           
        const { url, playbackRate = '1.00', preservesPitch = true } = await currentData.readTrack()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 100

        const { startTime, endTime } = this._selectionTimes
        
        const shareURL = `${url}?ch=${startTime}-${endTime}-${rate}-${pitch}`
        copyToClipBoard(shareURL)

        this._alert.displayAlert({ link: shareURL, linkMessage: 'Visit Shareable Snip', duration: 5000 })
    }

    get #inLyricsView() {
        return location.pathname.endsWith('lyrics')
    }

    #handleLyricsIcon = () => {
        setTimeout(() => {
            const setup = this.#lyricsAvailable
            setup ? this.#lyricsWrapper?.addEventListener('mouseup', this.#handleHighlight) 
                  : this.#lyricsWrapper?.removeEventListener('mouseup', this.#handleHighlight) 
            this.#toggleUI(setup)
        }, 250)
    }

    #handleHighlight = async () => {
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

        this.#toggleUI(true)
        this.#disableLyricsButtons(false)
    }

    get #lyricsAvailable() {
        if (!this.#inLyricsView) return false
        return !!this.#lyricsWrapper
    }

    #toggleUI(show) {
        const lyricsUI = document.getElementById('lyrics-ui')
        lyricsUI.style.display = show ? 'flex' : 'none'
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

    removeUI() {
        document.getElementById('lyrics-ui').remove()
    }
}
