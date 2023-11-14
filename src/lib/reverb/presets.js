const PARAMS = ['preDelay','bandwidth','diffuse','decay','damping','excursion','wet','dry']

const PRESETS = {
    //          preDelay bandwidth diffuse  decay    damping  excursion  wet      dry
    demi:     [ 1525   , 0.5683  , 0.5    , 0.3226 , 0.6446 , 0        , 0.2921 , 0.4361 ],
    short:    [ 596    , 0.983   , 0.9    , 0.8271 , 0.2975 , 2.8      , 0.1402 , 0.9000 ], 
    tall:     [ 0      , 0.9999  , 1      , 0.5    , 0.005  , 16       , 0.6    , 0.3    ], 
    grande:   [ 0      , 0.999   , 0.6    , 0.78   , 0.37   , 12       , 0.5015 , 0.5012 ], 
    venti:    [ 0      , 0.999   , 0.6    , 0.78   , 0.37   , 12       , 0.715  , 0.394  ], 
    trenta:   [ 0      , 0.7011  , 0.7331 , 0.88   , 0.35   , 12       , 0.7015 , 0.3012 ], 
    quaranta: [ 0      , 0.999   , 1      , 0.88   , 0.35   , 12       , 0.915  , 0.194  ], 
}

const drinkPresets = ['demi','short','tall','grande','venti','trenta','quaranta' ]
const convolverPresets = ['diffusor','kick','muffler','telephone']

const getParamsListForEffect = effect => {
    const effectValues = PRESETS[effect] 
    const paramsList = effectValues.map((value, idx) => ({ name: PARAMS[idx], value }))
    return paramsList
}

export { drinkPresets, convolverPresets, getParamsListForEffect }
