const PARAMS = [
    'preDelay',
    'bandwidth',
    'inputDiffusion1',
    'inputDiffusion2',
    'decay',
    'decayDiffusion1',
    'decayDiffusion2',
    'damping',
    'excursionRate',
    'excursionDepth',
    'dry',
    'wet'
]

const PRESETS = {
    white: [0, 0.9, 0.7, 0.7, 0.3, 0.5, 0.5, 0.6, 0.1, 0.1, 0.5, 0.5],
    green: [0, 0.9, 0.7331, 0.4534, 0.5, 0.6, 0.1992, 0.15, 0, 0, 0.7015, 0.3012],
    oolong: [2, 0.6, 0.4, 0.4, 0.3, 0.4, 0.4, 0.7, 0.05, 0.05, 0.7, 0.3],
    black: [5, 0.7, 0.5, 0.5, 0.4, 0.5, 0.5, 0.6, 0.1, 0.1, 0.6, 0.4],
    chai: [10, 0.8, 0.6, 0.6, 0.5, 0.6, 0.6, 0.5, 0.1, 0.1, 0.6, 0.4],
    matcha: [0, 0.7011, 0.7331, 0.4534, 0.8271, 0.7839, 0.1992, 0.5975, 0, 0, 0.7015, 0.3012],
    earl: [0, 0.7011, 0.7331, 0.5534, 0.8271, 0.6839, 0.6992, 0.3975, 2, 2, 0.7015, 0.3012],
    jasmine: [0, 0.7011, 0.7331, 0.4534, 0.8271, 0.7839, 0.1992, 0.5975, 2, 2, 0.7015, 0.3012],
    english: [0, 0.9, 0.35, 0.625, 0.72, 0.5, 0.711, 0.225, 0.3, 1.4, 0.5015, 0.5012],
    darjeeling: [0, 0.9, 0.75, 0.625, 0.88, 0.5, 0.711, 0.205, 0.3, 1.4, 0.7015, 0.3012]
}

const convolverPresets = ['diffusor', 'kick', 'muffler', 'telephone']
const drinkPresets = [
    'white',
    'green',
    'oolong',
    'black',
    'chai',
    'matcha',
    'earl',
    'jasmine',
    'english',
    'darjeeling'
]

const getParamsListForEffect = (effect) => {
    const effectValues = PRESETS[effect]
    const paramsList = effectValues.map((value, idx) => ({ name: PARAMS[idx], value }))
    return paramsList
}

export { drinkPresets, convolverPresets, getParamsListForEffect }
