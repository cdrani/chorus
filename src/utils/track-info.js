import { parseNodeString } from './parser.js'

function getTextNode({ text, isShortText }) {
    const shortTextHtml = `<p>${text}</p>`
    const displayText = isShortText
        ? shortTextHtml
        : `<div>${shortTextHtml}&ensp;&bullet;&ensp;${shortTextHtml}&ensp;&centerdot;&ensp;</div>` 

    return parseNodeString(displayText) 
}

function setNowPlayingTextElement({ element, text, textColour, chorusView }) {
    const isShortText = text.length < (chorusView ? 43 : 28)
    const textNode = getTextNode({ isShortText, text })

    element.replaceChildren(textNode)
    element.style.color = textColour

    isShortText ? element.classList.remove('marquee') : element.classList.add('marquee')
}

export function setTrackInfo({ title, artists, textColour = '#000', chorusView = false }) {
    if (!title || !artists) return

    const titleElement = document.getElementById('track-title')
    const artistsElement = document.getElementById('track-artists')

    setNowPlayingTextElement({ 
          element: titleElement, text: title, textColour: chorusView ? '#fff' : textColour, chorusView
    })
    setNowPlayingTextElement({ 
        element: artistsElement, text: artists, textColour: chorusView ? '#b3b3b3' : textColour, chorusView
    })
}
