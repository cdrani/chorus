import { extToggle } from './toggle.js'

const coverImage = () => `
    <canvas id="canvas" style="display:none"></canvas>
    <img id="cover" loading="eager" style="height:64px;width:64px;" />
    <img id="double" loading="eager" style="display:none;height:64px;width:64px" />
`

const trackText = id => `
    <div class="container" style="max-width:200px">
        <div class="track-text" id="${id}" style="font-size:14px;font-weight:500"></div>
    </div>
`

export const SVG_PATHS = {
    seek: '<path d="M34.46,53.91A21.91,21.91,0,1,0,12.55,31.78"/><polyline points="4.65 22.33 12.52 32.62 22.81 24.75"/>',
    block: '<path fill-rule="evenodd" d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z" clip-rule="evenodd"/>',
    play: '<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>',
    pause: '<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>',
    next: '<path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/>',
    previous: '<path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/>',
    heart: '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>',
    shuffle: '<path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"/>',
    repeat: '<path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"/>',
    repeat1: '<path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5zM12.25 2.5h-.75V1h.75A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25z"/><path d="M9.12 8V1H7.787c-.128.72-.76 1.293-1.787 1.313V3.36h1.57V8h1.55z"/>'
}

const seekPosition = { ff: 'left:50%', rw: 'right:50%' }

const createIcon = ({ type, id = '', role = '', lw = 20, viewBox = '-4 -4 24 24', styles = '' }) => `
    <button 
        role="${role || type}"
        id="${(id || type) + '-btn'}"
        style="position:relative;padding:0;border:none;background:none;display:flex;justify-content:center;align-items:center;cursor:pointer;${styles}"
    > 
        ${id !== '' ? `<span id="seek-${id}" style="position:absolute;z-index:-10;background:transparent;font-weight:bold;font-size:small;top:46%;text-align:center;${seekPosition[id]}">10</span>` : ''}
        ${['repeat', 'shuffle'].includes(type) 
            ? `<span style="display:none;position:absolute;height:0;bottom:6px" id="${type}-dot">&bull;</span>` : ''
        }
        <svg
            width="${lw}"
            height="${lw}"
            viewBox="${viewBox}"
            stroke="currentColor"
            id="${(id || type) + '-icon'}"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            fill="${type == 'seek' ? 'none' : 'currentColor'}"
            style="${id == 'ff' ? 'transform: scaleX(-1)' : ''}"
        >
            ${SVG_PATHS[type]}
        </svg>
    </button>
`

const generateMediaIcons = () => `
    ${createIcon({ type: 'shuffle' })}
    ${createIcon({ type: 'seek', role: 'seek-rewind', id: 'rw', viewBox: '0 0 64 64' })}
    ${createIcon({ type: 'previous', lw: 24 })}
    ${createIcon({ type: 'play', role: 'play/pause', styles: 'border-radius:32px;width:32px;height:32px' })}
    ${createIcon({ type: 'next', lw: 24 })}
    ${createIcon({ type: 'seek', role: 'seek-fastforward', id: 'ff', viewBox: '0 0 64 64' })}
    ${createIcon({ type: 'repeat', lw: 24 })}
`

export const createRootContainer = () => `
    <div id="chorus">
        <div id="chorus-toggle">${extToggle.ui}</div>
        <div id="chorus-popup">
            <div id="frame" style="width:64px;height:64px">${coverImage()}</div>
            <div style="display:flex;flex-direction:column;width:100%;justify-content:space-evenly">
                ${trackText('track-title')}
                ${trackText('track-artists')}
            </div>
        </div>

        <div id="media-controls" style="display:flex;width:100%;height:32px;align-items:center;justify-content:space-between">
            <div id="left-controls" style="display:flex;justify-content:space-between;width:40px;margin-right:20px;">
                ${createIcon({ type: 'heart', role: 'save/unsave', lw: 24, viewBox: '-5 -5 24 24' })}
                ${createIcon({ type: 'block', role: 'block-track', lw: 24, viewBox: '-3 -3 24 24' })}
            </div>
            <div id="right-controls" style="display:flex;width:100%;justify-content:center;align-items:center">
                <div style="display:flex;width:100%;justify-content:space-between;align-items:center">
                    ${generateMediaIcons()}
                </div>
            </div>
        </div>
    </div>
`
