const isHighlightable = ({ 
    isSnip, 
    isShared, 
    playbackRate = '1',
    preservesPitch = true,
}) => (
    (isSnip && !isShared) || !preservesPitch || playbackRate !== '1'
)

export const highlightElement = ({ 
    selector, 
    songStateData,
    context = document,
    property = 'stroke', 
}) => {
    const element = context.querySelector(selector)
    const fillColor = isHighlightable(songStateData) ? '#1ed760' : 'currentColor'

    if (!element) return

    element.style[property] = fillColor
}
