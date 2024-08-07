export const EQ_FILTERS = [
    { freq: 20, gain: 0, type: 'lowshelf' },
    { freq: 32, gain: 0, type: 'lowshelf' },
    { freq: 50, gain: 0, type: 'lowshelf' },
    { freq: 64, gain: 0, type: 'peaking' },
    { freq: 125, gain: 0, type: 'peaking' },
    { freq: 150, gain: 0, type: 'peaking' },
    { freq: 250, gain: 0, type: 'peaking' },
    { freq: 400, gain: 0, type: 'peaking' },
    { freq: 500, gain: 0, type: 'peaking' },
    { freq: 1000, gain: 0, type: 'peaking' },
    { freq: 2000, gain: 0, type: 'peaking' },
    { freq: 2400, gain: 0, type: 'peaking' },
    { freq: 3000, gain: 0, type: 'peaking' },
    { freq: 4000, gain: 0, type: 'peaking' },
    { freq: 6000, gain: 0, type: 'peaking' },
    { freq: 8000, gain: 0, type: 'peaking' },
    { freq: 12000, gain: 0, type: 'peaking' },
    { freq: 14000, gain: 0, type: 'highshelf' },
    { freq: 16000, gain: 0, type: 'highshelf' }
]

const SPOTIFY_PRESETS = {
    Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Acoustic: [1.5, 1.0, 0.0, -1.0, -1.5, -1.0, 0.0, 1.0, 1.5, 2.0],
    'Bass booster': [6.0, 6.0, 6.0, 3.6, 0.0, -3.0, -6.0, -7.2, -7.2, -7.2],
    'Bass reducer': [-6.0, -6.0, -6.0, -3.0, 0.0, 3.0, 6.0, 7.2, 7.2, 7.2],
    Classical: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -4.32, -4.32, -4.32, -5.76],
    Dance: [5.76, 4.32, 1.44, 0.0, 0.0, -3.36, -4.32, -4.32, 0.0, 0.0],
    Deep: [5.0, 4.5, 3.0, -2.0, -4.0, -5.0, -6.0, -6.5, -6.5, -6.5],
    Electronic: [4.8, 3.36, 0.0, -3.36, -2.88, 0.0, 4.8, 5.76, 5.76, 5.28],
    HipHop: [5.0, 5.0, 4.0, -3.0, -4.0, -5.0, -5.0, -5.0, -4.0, -3.0],
    Jazz: [3.0, 3.0, 2.5, 0.0, -2.0, -3.0, -2.0, -1.5, -1.0, -0.5],
    Latin: [4.0, 3.5, 1.5, -2.5, -4.0, -5.0, -4.5, -3.5, -2.5, -1.5],
    Loudness: [5.0, 5.0, 5.0, 0.0, 0.0, 0.0, 5.0, 5.0, 5.0, 5.0],
    Lounge: [1.5, 1.5, 1.0, 0.0, -1.0, -1.5, -1.5, -1.0, -0.5, 0.0],
    Piano: [3.0, 3.0, 2.0, -1.0, -2.0, -3.0, -2.5, -1.5, -1.0, -0.5],
    Pop: [0.96, 2.88, 4.32, 4.8, 3.36, 0.0, -1.44, -1.44, 0.96, 0.96],
    RnB: [5.0, 4.5, 3.5, 0.0, -3.0, -5.0, -6.0, -6.5, -6.5, -6.5],
    Rock: [4.8, 2.88, -3.36, -4.8, -1.92, 2.4, 5.28, 6.72, 6.72, 6.72],
    'Small speakers': [3.0, 2.5, 2.0, -2.5, -3.5, -5.0, -5.0, -5.0, -4.5, -4.0],
    'Spoken word': [2.0, 2.0, 1.5, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0],
    'Treble booster': [-6.0, -6.0, -6.0, -3.0, 0.0, 3.0, 6.0, 7.2, 7.2, 8.4],
    'Treble reducer': [6.0, 6.0, 6.0, 3.0, 0.0, -3.0, -6.0, -7.2, -7.2, -8.4],
    'Vocal booster': [0.0, 0.0, 2.4, 4.8, 4.8, 2.4, 0.0, -1.2, -1.2, 0.0]
}

const CUSTOM_PRESETS = {
    Club: [0.0, 0.0, 4.8, 3.36, 3.36, 3.36, 1.92, 0.0, 0.0, 0.0],
    Live: [-2.88, 0.0, 2.4, 3.36, 3.36, 3.36, 2.4, 1.44, 1.44, 1.44],
    Party: [4.32, 4.32, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.32, 4.32],
    Soft: [2.88, 0.96, 0.0, -1.44, 0.0, 2.4, 4.8, 5.76, 6.72, 7.2],
    Ska: [-1.44, -2.88, -2.4, 0.0, 2.4, 3.36, 5.28, 5.76, 6.72, 5.76],
    Reggae: [0.0, 0.0, 0.0, -3.36, 0.0, 3.84, 3.84, 0.0, 0.0, 0.0],
    Headphones: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64],
    SoftRock: [2.4, 2.4, 1.44, 0.0, -2.4, -3.36, -1.92, 0.0, 1.44, 5.28],
    LargeHall: [6.24, 6.24, 3.36, 3.36, 0.0, -2.88, -2.88, -2.88, 0.0, 0.0],
    Bass: [4.8, 5.76, 5.76, 3.36, 0.96, -2.4, -4.8, -6.24, -6.72, -6.72],
    Treble: [-5.76, -5.76, -5.76, -2.4, 1.44, 6.72, 9.6, 9.6, 9.6, 10.08],
    Laptop: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64],
    BassTreble: [4.32, 3.36, 0.0, -4.32, -2.88, 0.96, 4.8, 6.72, 7.2, 7.2],
    Podcast: [0.0, 0.0, 1.2, 2.4, 4.8, 2.4, 0.0, -1.2, -2.4, -3.6],
    SmallRoom: [2.0, 1.5, 0.0, -1.5, -2.0, -1.5, 0.0, 1.5, 2.0, 2.5],
    LargeRoom: [3.0, 2.0, 0.0, -2.0, -3.0, -2.0, 0.0, 2.0, 3.0, 4.0],
    ConcertHall: [2.5, 2.0, 1.0, 0.0, -1.0, -1.0, 0.0, 2.0, 3.0, 3.5],
    Auditorium: [2.0, 1.5, 0.0, -1.5, -2.0, -1.5, 0.5, 2.0, 2.5, 3.0],
    Outdoor: [3.0, 2.5, 1.5, 0.0, -1.5, -1.5, 0.0, 2.0, 2.5, 3.0]
}

export const spotifyPresets = Object.keys(SPOTIFY_PRESETS)
export const customPresets = Object.keys(CUSTOM_PRESETS)

export const EQ_PRESETS = Object.assign(SPOTIFY_PRESETS, CUSTOM_PRESETS)
export const eqPresetLabels = Object.keys(EQ_PRESETS)
