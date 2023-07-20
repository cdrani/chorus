import TrackListIcon from "./tracklist-icon.js"

export default class SnipIcon extends TrackListIcon {
    #selector = 'button[role="snip"]'

    constructor(store) {
        super({
            store,
            key: 'isSnip',
            selector: 'button[role="snip"]'
        }) 
    }

    setInitialState(row) {
        super._setInitialState(row)
    }

    #getSnipIcon(row) {
        return row.querySelector(this.#selector)            
    }

    setUI(row) {
        super._setUI(row)
    }

    setClickEvent(row) {
        const icon = this.#getSnipIcon(row)

        icon?.addEventListener('click', async () => {
            // TODO: open snip modal with clicked row info
        })
    }

    get _iconUI() {
        return `
            <button 
                role="snip"
                type="button"
                aria-label="Edit Snip"
                style="visibility:hidden;border:none;background:none;display:flex;align-items:center;cursor:pointer"
            >
                <svg
                    role="img"
                    fill="none"
                    width="16px"
                    height="16px"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    style="margin-bottom:4px;"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                </svg>
            </button>
        `
    }
}
