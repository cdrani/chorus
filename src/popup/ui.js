import { extToggle } from './toggle.js'

const coverImage = () => `
    <canvas id="canvas" style="display:none"></canvas>
    <img id="cover" loading="eager" style="height:64px;width:64px;" />
    <img id="double" loading="eager" style="display:none;height:64px;width:64px" />
`

export const createRootContainer = () => `
    <div id="chorus">
        <div id="chorus-toggle">${extToggle.ui}</div>
        <div id="chorus-popup">
            <div id="frame" style="width:64px;height:64px">${coverImage()}</div>
            <div style="display:flex;flex-direction:column;width:100%;justify-content:space-evenly">
                <div class="container"><div class="track-text" id="track-title"></div></div>
                <div class="container"><div class="track-text" id="track-artists"></div></div>
            </div>
        </div>
    </div>
`
