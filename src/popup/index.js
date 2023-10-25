import { parseNodeString } from '../utils/parser.js'
import { createRootContainer } from './ui.js'

const placeIcons = () => {
    const root = createRootContainer()
    const rootEl = parseNodeString(root)
    document.body.appendChild(rootEl)
}

const setTrackInfo = ({ title, artists }) => {
    if (!title || !artists) return

    const { titleElement, artistsElement } = getElements()

    titleElement.innerHTML = `<p>${title}</p>`
    artistsElement.innerHTML = `<p>${artists}</p>`

    if (titleElement.scrollWidth > titleElement.clientWidth) {
        titleElement.innerHTML += `&emsp;${titleElement.innerHTML}&emsp;`
        titleElement.classList.add('marquee')
    } else {
        titleElement.classList.remove('marquee')
    }

    if (artistsElement.scrollWidth > artistsElement.clientWidth) {
        artistsElement.innerHTML += `&emsp;${artistsElement.innerHTML}&emsp;`
        artistsElement.classList.add('marquee')
    } else {
        artistsElement.classList.remove('marquee')
    }
}

const setCoverImage = async ({ cover, title, artists }) => {
    const { double } = getElements()
    if (!double || !cover) return

    await loadImage({ url: cover, elem: double })
    if (double.complete) updateBackgroundAndTextColours({ imageElement: double, title, artists })
}

async function loadImage({ url, elem }) {
    return new Promise((resolve, reject) => {
        elem.onload = () => resolve(elem)
        elem.onerror = reject
        elem.src = url
    })
}

function getImageData(img) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)

    return ctx.getImageData(0, 0, canvas.width, canvas.height).data
}

function kmeans(data, options) {
    const k = options.k
    const tolerance = options.tolerance || 1e-6
    const maxIterations = options.maxIterations || 100

    let centroids = data.slice(0, k)

    for (let iter = 0; iter < maxIterations; iter++) {
        const clusters = Array.from({ length: k }, () => [])

        for (const point of data) {
            let minDist = Infinity
            let clusterIndex = -1

            for (let i = 0; i < k; i++) {
                const dist = point.reduce((acc, dim, j) => (acc + (dim - centroids[i][j]) ** 2), 0)

                if (dist < minDist) {
                    minDist = dist
                    clusterIndex = i
                }
            }

            clusters[clusterIndex].push(point)
        }

        const newCentroids = clusters.map((cluster) => {
            return cluster.reduce((acc, point) => (
                point.map((dim, i) => acc[i] + dim / cluster.length)
            ), Array(data[0].length).fill(0))
        })

        const converged = centroids.every((centroid, i) => (
            centroid.every((dim, j) => Math.abs(dim - newCentroids[i][j]) < tolerance)
        ))

        if (converged) break 

        centroids = newCentroids
    }

    return { centroids }
}

function calculateColorPercentage(pixels, color, tolerance = 10) {
    // Divide by 4 since each pixel has 4 components (R, G, B, A)
    const totalPixels = pixels.length / 4 

    let count = 0
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]

        // Calculate the Euclidean distance between colors
        const distance = Math.sqrt(
            Math.pow(r - color[0], 2) + Math.pow(g - color[1], 2) + Math.pow(b - color[2], 2)
        )

        if (distance <= tolerance) count++
    }

    return (count / totalPixels) * 100
}

function getPalette(pixels) {
    const colorCounts = {}
    const pixelArray = []

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]

        const color = [r, g, b]
        pixelArray.push(color)

        if (colorCounts[color]) {
            colorCounts[color]++
        } else {
            colorCounts[color] = 1
        }
    }

    const result = kmeans(pixelArray, { k: 6, tolerance: 10 })

    const palette = result.centroids.map((centroid) => {
        const color = `rgb(${Math.round(centroid[0])}, ${Math.round(centroid[1])}, ${Math.round(centroid[2])})`
        const percentage = calculateColorPercentage(pixels, centroid)
        return { 
            color,
            percentage,
            base: [Math.round(centroid[0]), Math.round(centroid[1]), Math.round(centroid[2])],
        }
    })

    const sortedPalette = palette.sort((a,b) => b.percentage - a.percentage )
    return sortedPalette
}

function sortByProximityToPrimaryColors(colors) {
    const primaryColors = { red: [255, 0, 0], green: [0, 255, 0], blue: [0, 0, 255] }

    // Custom sorting function to sort by proximity to primary colors.
    function customSort(a, b) {
        const calculateDistance = (color, primaryColor) => (
            color.base.reduce((sum, value, index) => (
                sum + Math.pow(value - primaryColor[index], 2)
            ), 0)
        )

        const closestPrimaryA = Math.min(
            calculateDistance(a, primaryColors.red),
            calculateDistance(a, primaryColors.green),
            calculateDistance(a, primaryColors.blue)
        )

        const closestPrimaryB = Math.min(
            calculateDistance(b, primaryColors.red),
            calculateDistance(b, primaryColors.green),
            calculateDistance(b, primaryColors.blue)
        )

        // If the closest primary colors are the same, favor the darker shades.
        if (closestPrimaryA === closestPrimaryB) {
            return closestPrimaryA - calculateDistance(b, [0, 0, 0])
        }

        return closestPrimaryA - closestPrimaryB
    }

    return colors.sort(customSort)
}

async function updateBackgroundAndTextColours({ imageElement, title, artists }) {
    const { cover, artistsElement, chorusPopup, titleElement } = getElements()

    const imageData = getImageData(imageElement)
    const palette = getPalette(imageData)
    const sortedPalette = sortColorsByProximityAndLuminance(palette.slice())

    const background = sortedPalette.at(0)
    const nextPrimary = sortByProximityToPrimaryColors(sortedPalette.slice(1)).at(0)
    
    const accessibleTextColor = getContrastColor(background.base, nextPrimary.base)
    chorusPopup.style.backgroundColor = background.color
    titleElement.style = `font-size:14px;color:${accessibleTextColor}` 
    artistsElement.style = `font-size:14px;color:${accessibleTextColor}`

    cover.src = imageElement.src
    cover.style.boxShadow = `0 0 8px 8px ${background.color} inset`
    setTrackInfo({ title, artists })
    
    await setState({
        key: 'popup-ui', 
        value: {
            title, 
            artists,
            src: imageElement.src,
            textColor: accessibleTextColor,
            backgroundColor: background.color,
        }
    })
}

function calculateLuminance([ r, g, b ]) {
    const gamma = 2.2
    const rLinear = r / 255
    const gLinear = g / 255
    const bLinear = b / 255

    return 0.2126 * Math.pow(rLinear, gamma) + 
        0.7152 * Math.pow(gLinear, gamma) + 0.0722 * Math.pow(bLinear, gamma)
}

function sortColorsByProximityAndLuminance(colors) {
    const colorGroups = {}
    colors.forEach(color => {
        const baseColor = color.base.toString()
        if (!colorGroups[baseColor]) {
            colorGroups[baseColor] = []
        }
        colorGroups[baseColor].push(color)
    })

    // Sort each color group by luminance
    for (const baseColor in colorGroups) {
        colorGroups[baseColor].sort((a, b) => {
            const luminanceA = calculateLuminance(a.base)
            const luminanceB = calculateLuminance(b.base)

            // Sort by luminance in descending order (darker colors first)
            return luminanceB - luminanceA
        })
    }

    const sortedColors = []
    for (const baseColor in colorGroups) {
        sortedColors.push(...colorGroups[baseColor])
    }

    return sortedColors
}

function getContrastColor(backgroundRGB, textColorRGB, targetContrast = 7 ) {
    function getRelativeLuminance(colorRGB) {
        const [R, G, B] = colorRGB.map(value => {
            const sRGB = value / 255
            return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * R + 0.7152 * G + 0.0722 * B
    }

    const L1 = getRelativeLuminance(backgroundRGB)

    // Calculate the required luminance of the text color for the desired contrast ratio.
    const L2 = L1 + targetContrast * 0.05

    // Function to adjust a single channel's value while staying in the [0, 255] range and making it darker.
    function adjustChannelDark(currentValue, L2, L1) {
        return Math.min(currentValue, Math.max(0, Math.round((L2 / L1) * currentValue)))
    }

    const adjustedColorDark = [
        adjustChannelDark(textColorRGB[0], L2, L1),
        adjustChannelDark(textColorRGB[1], L2, L1),
        adjustChannelDark(textColorRGB[2], L2, L1),
    ]

    const adjustedContrastDark = getContrastRatio(adjustedColorDark, backgroundRGB)

    if (adjustedContrastDark >= 4.5) {
        return `rgb(${adjustedColorDark.join(', ')})`
    }

    // Function to adjust a single channel's value while staying in the [0, 255] range and making it lighter.
    function adjustChannelLight(currentValue, L2, L1) {
        return Math.min(255, Math.max(currentValue, Math.round((L1 / L2) * currentValue)))
    }

    const adjustedColorLight = [
        adjustChannelLight(textColorRGB[0], L2, L1),
        adjustChannelLight(textColorRGB[1], L2, L1),
        adjustChannelLight(textColorRGB[2], L2, L1),
    ]

    const adjustedContrastLight = getContrastRatio(adjustedColorLight, backgroundRGB)

    if (adjustedContrastLight >= 4.5) return `rgb(${adjustedColorLight.join(', ')})`

    const contrastWithBlack = getContrastRatio(backgroundRGB, [0, 0, 0])
    const contrastWithWhite = getContrastRatio(backgroundRGB, [255, 255, 255])
    return contrastWithBlack > contrastWithWhite ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
}

function getContrastRatio(foregroundRGB, backgroundRGB) {
    const L1 = getRelativeLuminance(foregroundRGB)
    const L2 = getRelativeLuminance(backgroundRGB)

    if (L1 > L2) return (L1 + 0.05) / (L2 + 0.05)

    return (L2 + 0.05) / (L1 + 0.05)
}

function getRelativeLuminance(colorRGB) {
    const [R, G, B] = colorRGB.map(value => {
        const sRGB = value / 255
        if (sRGB <= 0.03928) return sRGB / 12.92

        return Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function getElements() {
    return {
        cover: document.getElementById('cover'),
        double: document.getElementById('double'),
        chorusPopup: document.getElementById('chorus-popup'),
        titleElement: document.getElementById('track-title'),
        artistsElement: document.getElementById('track-artists'),
    }
}

function loadImageData({ src, title, artists, backgroundColor, textColor }) {
    const { artistsElement, titleElement, cover, chorusPopup } = getElements()

    cover.src = src
    cover.style.boxShadow = `0 0 4px 4px ${backgroundColor} inset`

    chorusPopup.style.backgroundColor = backgroundColor
    titleElement.style = `font-size:14px;color:${textColor}`
    artistsElement.style = `font-size:14px;color:${textColor}`

    setTrackInfo({ title, artists })
}

async function setupFromStorage() {
    const data = await getState('popup-ui')
    if (!data) return { data: null, loaded: false }

    loadImageData(data) 
    return { loaded: true, data }
}

const loadInitialData = async () => {
    const { data, loaded } = await setupFromStorage()
    const currentData = await getState('now-playing')

    if (loaded & data?.src == currentData?.cover) return 

    setCoverImage(currentData)
}

placeIcons()
loadInitialData()

function stateResolver({ resolve, reject, result, key, values }) {
    if (chrome.runtime.lastError) {
        console.error({ error: chrome.runtime.lastError })
        return reject({ error: chrome.runtime.lastError })
    }

    if (key) return resolve(result?.[key])
    if (values) return resolve(values)

    return resolve(result)
}

function setState({ key = 'popup-ui', value = {} }) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, result => stateResolver({ resolve, reject, result }))
    })
}

function getState(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, result => stateResolver({ key, resolve, reject, result }))
    })
}

chrome.runtime.onMessage.addListener(async ({ type, data }) => {
    if (type == 'app.now-playing') await setCoverImage(data)
})
