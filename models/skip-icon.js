import TrackListIcon from "./tracklist-icon.js"

export default class SkipIcon extends TrackListIcon {
    #selector = 'button[role="blocker"]'

    constructor(store) {
        super({ 
            store, 
            key: 'isSkipped', 
            selector: 'button[role="blocker"]'
        }) 
    }

    setInitialState(row) {
        super._setInitialState(row)
    }

    #getSkipIcon(row) {
        return row.querySelector(this.#selector)            
    }

    setMouseEvents(row) {
        const icon = this.#getSkipIcon(row)
        super._setMouseEvents(icon)
    }

    setUI(row) {
        super._setUI(row)
    }

    // setUI(row) {
    //     if (!row) return

    //     if (!this.#getSkipIcon(row)) {
    //         const heartIcon = row.querySelector('button[data-testid="add-button"]')
    //         heartIcon.insertAdjacentHTML('beforebegin', this.#iconUI)
    //     }

    //     const icon = this.#getSkipIcon(row)
    //     icon.style.display = 'flex'
    // }

    setMouseEvents(row)  {
        const icon = this.#getSkipIcon(row)
        super._setMouseEvents(icon)
    }

    setClickEvent(row) {
        const icon = this.#getSkipIcon(row)

        icon?.addEventListener('click', async () => {
            await super._saveTrack(row)
            super._animate(icon)
        })
    }

    get _iconUI() {
        return `
            <button 
                type="button"
                role="blocker"
                aria-label="Skip Song"
                style="visibility:hidden;border:none;background:none;display:flex;align-items:center;"
            >
                <svg 
                    role="img"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fill-rule="evenodd" d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z" clip-rule="evenodd" />
                </svg>
            </button>
        `
    }
}
