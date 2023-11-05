import { extToggle } from './toggle.js'
import { createRootContainer } from './ui.js'

import { parseNodeString } from '../utils/parser.js'
import { getState, setState } from '../utils/state.js'
import { getImageBackgroundAndTextColours } from '../utils/image-colours.js'

// Create a connection to the background script
const PORT = chrome.runtime.connect({ name: "popup" })

PORT.onMessage.addListener(async ({ type, data }) => {
    if (!['enabled', 'now-playing'].includes(type)) return

    if (type == 'enabled')  {
        const enabled = data == {} ? false : data
        await extToggle.initialize(enabled, loadExtOffState)
    }

    if (type == 'now-playing' && (!data || data == {})) return
    await setCoverImage(data)
})

function setNowPlayingTextElement({ element, text, textColour }) {
    element.innerHTML = `<p>${text}</p>`
    element.style.color = textColour

    if (text.length < 28) return element.classList.remove('marquee')

    element.innerHTML += `&emsp;&emsp;${element.innerHTML}&emsp;&emsp;`
    element.classList.add('marquee')
}

function setTrackInfo({ title, artists, textColour = '#000' }) {
    if (!title || !artists) return

    const { titleElement, artistsElement } = getElements()

    setNowPlayingTextElement({ element: titleElement, text: title, textColour })
    setNowPlayingTextElement({ element: artistsElement, text: artists, textColour })
}

async function updatePopupUIState(popupState) {
    await setState({ key: 'popup-ui', values: popupState })
}

async function updatePopupUI({ src, title, artists, textColour, backgroundColour }) {
    const { cover, chorusPopup } = getElements()

    chorusPopup.style.backgroundColor = backgroundColour

    cover.src = src

    setTrackInfo({ title, artists, textColour })
    await updatePopupUIState({ title, artists, textColour, src, backgroundColour })
}

async function setCoverImage({ cover, title, artists }) {
    const { double } = getElements()
    if (!double || !cover) return

    await loadImage({ url: cover, elem: double })
    if (double.complete) { 
        const { textColour, backgroundColour } = getImageBackgroundAndTextColours(double)
        await updatePopupUI({ src: cover, title, artists, textColour, backgroundColour })
        extToggle.setFill(textColour)
    }
}

async function loadImage({ url, elem }) {
    return new Promise((resolve, reject) => {
        elem.onload = () => resolve(elem)
        elem.onerror = reject
        elem.crossOrigin = 'Anonymous'
        elem.style.transform = 'unset'
        elem.src = url
    })
}

function getElements() {
    return {
        cover: document.getElementById('cover'),
        double: document.getElementById('double'),
        chorusPopup: document.getElementById('chorus'),
        titleElement: document.getElementById('track-title'),
        artistsElement: document.getElementById('track-artists'),
    }
}

function loadImageData({ src, title, artists, backgroundColour, textColour }) {
    const { cover, chorusPopup } = getElements()

    cover.src = src
    chorusPopup.style.backgroundColor = backgroundColour
    setTrackInfo({ title, artists, textColour })
}

async function setupFromStorage() {
    const data = await getState('popup-ui')
    if (!data) return { data: null, loaded: false }

    loadImageData(data) 
    return { loaded: true, data }
}

function loadDefaultUI(enabled) {
    const { chorusPopup, cover } = getElements()

    cover.src = '../icons/logo.png'
    cover.style.transform = 'scale(1.15)'

    const title = enabled 
        ? 'No Active Spotify Tab Open Or Media Playing'
        : 'Chorus Toggled Off. Turn On To Enhance Spotify.'

    setTrackInfo({ title, artists: 'Chorus - Spotify Enhancer' })

    chorusPopup.style.backgroundColor = '#1ED760'
    extToggle.setFill('#000')
}

async function loadExtOffState(enabled) {
    if (!enabled) return loadDefaultUI(enabled)

    const { cover } = getElements()
    const { data, loaded } = await setupFromStorage()
    const currentData = await getState('now-playing')

    if (!data && !currentData) return loadDefaultUI(enabled)

    cover.style.transform = 'unset'
    if (loaded & data?.title == currentData?.title) return extToggle.setFill(data.textColour)

    if (!currentData?.isSkipped) await setCoverImage(currentData)
}

function placeIcons() {
    const root = createRootContainer()
    const rootEl = parseNodeString(root)
    document.body.appendChild(rootEl)
    extToggle.setupEvents(loadExtOffState)
}

async function loadInitialData() {
    const enabled = await getState('enabled')
    const { data, loaded } = await setupFromStorage()
    const currentData = await getState('now-playing')

    await extToggle.initialize(enabled, loadExtOffState)
    if (!data && !currentData) return loadDefaultUI()

    if (enabled && loaded & data?.title == currentData?.title) {
        return extToggle.setFill(data.textColour)
    }

    if (enabled && !currentData?.isSkipped) await setCoverImage(currentData)
}

placeIcons()
loadInitialData()
