const isHighlightable = ({ 
    isSnip, 
    isSkipped,
    playbackRate = '1',
    preservesPitch = true,
}) => (
    isSnip || isSkipped || !preservesPitch || playbackRate !== '1'
)

export const highlightElement = ({ 
    selector, 
    songStateData,
    context = document,
    property = 'stroke', 
}) => {
    let element
    const timer = setInterval(() => {
        if (element) { clearInterval(timer); return }

        element = context.querySelector(selector)
        if (!element) return

        const fillColor = isHighlightable(songStateData) ? '#1ed760' : 'currentColor'
        element.style[property] = fillColor
    }, 250)
}
