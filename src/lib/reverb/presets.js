export const PARAMS = [
    'preDelay',
    'bandwidth',
    'diffuse',
    'decay',
    'damping',
    'excursion',
    'wet',
    'dry',
]

const overtPresets = {
    //          preDelay bandwidth diffuse  decay    damping  excursion  wet      dry
    room:     [ 1525   , 0.5683  , 0.5    , 0.3226 , 0.6446 , 0        , 0.2921 , 0.4361 ],
    church:   [ 596    , 0.983   , 0.9    , 0.8271 , 0.2975 , 0.8      , 0.1402 , 0.9000 ],
    frozen:   [ 0      , 0.999   , 1      , 1      , 0.195  , 12       , 0.915  , 0.194  ],
    ethereal: [ 11000  , 0.999   , 0.8    , 0.86   , 0.3    , 30       , 0.71   , 0.30   ],
    sprinkle: [ 3800   , 1       , 0      , 0.43   , 0.09   , 0        , 0.70   , 0.45   ],
}

const customPresets = {
    //          preDelay bandwidth diffuse  decay    damping  excursion  wet      dry
    demi:     [ 0      , 0.9999  , 1      , 0.5    , 0.005  , 16       , 0.6    , 0.3    ], // default
    short:    [ 596    , 0.983   , 0.9    , 0.8271 , 0.2975 , 0.8      , 0.1402 , 0.9000 ], // based off church
    tall:     [ 596    , 0.983   , 0.9    , 0.8271 , 0.2975 , 2.8      , 0.1402 , 0.9000 ], // based off church
    grande:   [ 596    , 0.983   , 1      , 1      , 0.0975 , 2.8      , 0.1402 , 0.9000 ], // based off church
    venti:    [ 0      , 0.999   , 1      , 0.88   , 0.35   , 12       , 0.915  , 0.194  ], // based off frozen
    trente:   [ 0      , 0.999   , 0.6    , 0.78   , 0.37   , 12       , 0.715  , 0.394  ], // based off frozen
}

const PRESETS = { ...customPresets, ...overtPresets }

export const getParamsListForEffect = effect => {
    const effectValues = PRESETS[effect] 
    const paramsList = effectValues.map((value, idx) => ({ name: PARAMS[idx], value }))
    return paramsList
}
