import { createControls } from '../components/controls.js'

export default class Icon {
    constructor() {}

    // TODO: Icon should not be concerned with creating the main UI
    createRootContainer() {
        return `
            <div id="chorus">
                ${this.#createIcon()}
                <div id="chorus-main" style="display: none">
                    ${createControls()}
                </div>
            </div>
        `
    }

    #createIcon() {
        return `
            <button 
                role="snip"
                id="chorus-icon"
                aria-label="Edit Snip"
                class="chorus-hover-white"
                style="padding:0 6px;border:none;background:none;display:flex;justify-content:center;align-items:center;"
            >
                <svg
                    fill="none"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    id="chorus-highlight"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
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
