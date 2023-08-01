export const createAlert = () => `
    <div 
        id="chorus-alert"
        style="display:none;justify-content:space-between;align-items:center;border-radius:.5rem;z-index:99999;padding:.5rem 1.25rem;padding-right:.75rem;min-width:320px;width:60%;background:#1ed670;position:absolute;bottom:10%;right:2.5%;"
    >
        <p id="chorus-alert-message" style="font-size:1.25rem;color:#fff;"></p>
        <button id="chorus-alert-close-button" class="chorus-text-button" style="padding:.5rem;align-self:center;background:none;border:none">
            <svg 
                role="img"
                fill="none"
                width="24px"
                height="24px"
                stroke="#fff"
                stroke-width="2"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
`
