export function updateToolTip(element) {
    const ariaLabel = element?.getAttribute('aria-label')
    const toolTip = document.getElementById('tooltip')

    if (!toolTip || !ariaLabel) return

    if (['heart', 'settings', 'skip', 'ff', 'rw', 'loop'].includes(role))
        toolTip.textContent = ariaLabel

    toolTip.style.display = 'inline-block'
    const rect = element.getBoundingClientRect()
    const toolTipRect = toolTip.getBoundingClientRect()

    toolTip.style.left = `${rect.left + rect.width / 2 - toolTipRect.width / 2}px`
    toolTip.style.top = `${rect.top - 40}px`
}
