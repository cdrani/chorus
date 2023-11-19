import Dispatcher from '../../events/dispatcher.js'
import { currentSongInfo } from '../../utils/song.js'
import { parseNodeString } from '../../utils/parser.js'
import { currentData } from '../../data/current.js'

export default class LyricSnip {
    constructor() { 
        this.#createUI()
        this._active = false
        this._dispatcher = new Dispatcher()
        this._selectionTimes = {}
    }

    set active(active) {
        if (active !== this._active && active) this.#setupListeners() 
        this._active = active
    }

    get #lyricsShareBtn() { return document.getElementById('lyrics-share')}
    get #lyricsSaveBtn() { return document.getElementById('lyrics-save')}

    get #lyricsWrapper() { return document.querySelector('main > div > div > div') }
    get #lyricsIcon() { return document.querySelector('[data-testid="lyrics-button"]') }

    #setupListeners() { 
        if (this.#lyricsAvailable) this.#handleLyricsIcon()

        this.#lyricsIcon?.addEventListener('click', this.#handleLyricsIcon) 
    }

    #setupButtonEvents() {
        this.#lyricsShareBtn.addEventListener('click', this.#shareSnip)
        this.#lyricsSaveBtn.addEventListener('click', this.#saveSnip)
    }

    #shareSnip = async () => {
        const { playbackRate = '1.00', preservesPitch = true } = await currentData.readTrack()
        const pitch = preservesPitch ? 1 : 0
        const rate = parseFloat(playbackRate) * 100

        const { tempEndTime = startTime, tempStartTime = endTime } = this.tempShareTimes
        
        const shareURL = `${this.trackURL}?ch=${tempStartTime}-${tempEndTime}-${rate}-${pitch}`
        copyToClipBoard(shareURL)

        // this.displayAlert()
    }

    get #inLyricsView() {
        return location.pathname.endsWith('lyrics')
    }

    #handleLyricsIcon = () => {
        setTimeout(() => {
            this.#lyricsAvailable
                ? this.#lyricsWrapper?.addEventListener('mouseup', this.#handleHighlight) 
                : this.#lyricsWrapper?.removeEventListener('mouseup', this.#handleHighlight) 

            this.#toggleUI(this.#lyricsAvailable)
        }, 150)
    }

    #handleHighlight = async () => {
        const selection = window.getSelection()
        const selectedText = selection.toString().split('\n')
        if (selection.isCollapsed || !selectedText?.length) return
  
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

        const lines = response.data.lyrics.lines.slice(startPoint, startPoint + selectedText.length)
        const startTime = parseFloat(lines.at(0).startTimeMs) / 1000
        const endTime = parseFloat(lines.at(-1).startTimeMs) / 1000
        this._selectionTimes = { startTime, endTime }
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
        const ui =  parseNodeString(`
            <div id="lyrics-ui">
                <button id="lyric-share" class="share chorus-text-button"><span>share</span></button>
                <button id="lyric-save" class="success chorus-text-button"><span>save</span></button>
            </div>
        `)

        document.body.appendChild(ui)
    }

    removeUI() {
        document.getElementById('lyrics-ui').remove()
    }
}
