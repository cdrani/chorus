import TrackListIcon from "./tracklist-icon.js"

export default class SkipIcon extends TrackListIcon {
    constructor(store) {
        super({ 
            store, 
            key: 'isSkipped', 
            selector: 'button[role="skip"]'
        }) 
    }

    setInitialState(row) {
        super._setInitialState(row)
    }

    setUI(row) {
        super._setUI(row)
    }

    get _iconUI() {
        return `
            <button 
                role="skip"
                type="button"
                aria-label="Skip Song"
                style="visibility:hidden;border:none;background:none;display:flex;align-items:center;cursor:pointer;"
            >
                <svg 
                    role="skip"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        role="skip"
                        fill-rule="evenodd"
                        d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z" clip-rule="evenodd"
                    />
                </svg>
            </button>
        `
    }
}
