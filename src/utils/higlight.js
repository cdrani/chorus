const isHighlightable = ({ 
    isSnip, 
    isSkipped,
    playbackRate = '1',
    preservesPitch = true,
}) => (
    isSnip || isSkipped || !preservesPitch || !['1', '1.000', '1000'].includes(playbackRate)
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
        element.setAttribute(property, fillColor)
    }, 250)
}

export const highlightLoopIcon = highlight => {
    const svgIcon = document.getElementById('loop-icon')
    if (!svgIcon) return

    const colour = highlight ? '#1ed760' : 'currentColor'
    svgIcon.setAttribute('fill', colour)
    svgIcon.setAttribute('stroke', colour)
}

