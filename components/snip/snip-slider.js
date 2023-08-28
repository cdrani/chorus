import { secondsToTime } from '../../utils/time.js'

export const createSlider = ({ current, duration }) => `
    <div id="snippy" class="snippy">
        <p class="time">
            <span id="start">0:00</span>
        </p>

        <div class="slider-container">
            <input
              min="0"
              class="input"
              type="range"
              id="input-start"
              max="${duration}"
              value="${current}"
            >

            <input
                min="0"
                class="input"
                type="range"
                id="input-end"
                max="${duration}"
                value="${duration}"
            >

            <div class="slider">
                <div class="track"></div>
                <div class="range"></div>
                <div class="thumb left"></div>
                <div class="thumb right"></div>
            </div>
        </div>

        <p class="time end">
              <span id="end">
                ${secondsToTime(duration)}
            </span>
        </p>
    </div>
`
