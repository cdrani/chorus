export const createHeader = () => `
    <div class="chorus-common">
        <span class="chorus-header">chorus</span>
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;height:25px;align-items:center;justify-content:space-around;">
                <button 
                    role="snip"
                    id="chorus-snip-button"
                    ariaLabel="Snip Controls"
                    style="height:21px;padding:0 .25rem;padding-bottom:.125rem;font-size:14px" class="chorus-text-button">
                        <span>snip</span>
                </button>
                <button 
                    role="speed"
                    id="chorus-speed-button"
                    ariaLabel="Speed Controls"
                    style="height:21px;padding:0 .25rem;padding-bottom:.125rem;margin-left:.5rem;font-size:14px"
                    class="chorus-text-button"
                >
                    <span>speed</span>
                </button>
                <button 
                    role="seek"
                    id="chorus-seek-button"
                    ariaLabel="Seek Controls"
                    style="height:21px;padding:0 .25rem;padding-bottom:.125rem;margin:0 .5rem;font-size:14px"
                    class="chorus-text-button"
                >
                    seek
                </button>
            </div>

            <button id="chorus-modal-close-button" class="chorus-close-button">
                <svg 
                    role="img"
                    fill="none"
                    width="20px"
                    height="20px"
                    stroke="#fff"
                    stroke-width="2"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
`
