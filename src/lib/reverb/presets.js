const PARAMS = [
    'preDelay' , 'bandwidth' , 'inputDiffusion1' , 'inputDiffusion2' , 'decay' , 'decayDiffusion1' ,
    'decayDiffusion2' , 'damping', 'excursionRate', 'excursionDepth', 'dry', 'wet'
]

const PRESETS = {
    //        pD bw      iD1     iD2     decay   dD1     dD2     damping eR   eD   dry     wet     
    demi:   [ 0, 0.9   , 0.7331, 0.4534, 0.5   , 0.6   , 0.1992, 0.15  , 0  , 0  , 0.7015, 0.3012 ],
    short:  [ 0, 0.7011, 0.7331, 0.4534, 0.8271, 0.7839, 0.1992, 0.5975, 0  , 0  , 0.7015, 0.3012 ],
    tall:   [ 0, 0.7011, 0.7331, 0.4534, 0.8271, 0.7839, 0.1992, 0.5975, 2  , 2  , 0.7015, 0.3012 ],
    grande: [ 0, 0.7011, 0.7331, 0.5534, 0.8271, 0.6839, 0.6992, 0.3975, 2  , 2  , 0.7015, 0.3012 ],
    venti:  [ 0, 0.9   , 0.75  , 0.625 , 0.88  , 0.5   , 0.711 , 0.205 , 0.3, 1.4, 0.7015, 0.3012 ],
    trenta: [ 0, 0.9   , 0.35  , 0.625 , 0.72  , 0.5   , 0.711 , 0.225 , 0.3, 1.4, 0.5015, 0.5012 ],
}

const convolverPresets = [ 'diffusor', 'kick', 'muffler', 'telephone' ]
const drinkPresets =     [ 'demi', 'short' , 'tall' , 'grande' , 'venti' , 'trenta' ]

const getParamsListForEffect = effect => {
    const effectValues = PRESETS[effect] 
    const paramsList = effectValues.map((value, idx) => ({ name: PARAMS[idx], value }))
    return paramsList
}

export { drinkPresets, convolverPresets, getParamsListForEffect }
