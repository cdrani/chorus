const isHighlightable = ({ 
    isSnip, 
    playbackRate = '1',
    preservesPitch = true,
}) => (
    isSnip || !preservesPitch || playbackRate !== '1'
)

export const highlightElement = ({ 
    selector, 
    songStateData,
    context = document,
    property = 'stroke', 
}) => {
    setTimeout(() => {
        const element = context.querySelector(selector)
        const fillColor = isHighlightable(songStateData) ? '#1ed760' : 'currentColor'

        if (!element) return

        element.style[property] = fillColor
    }, 1000)
}
