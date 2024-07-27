export const EQ_FILTERS = [
    { freq: 20, gain: 0, type: 'lowshelf' }, // Sub-bass frequencies
    { freq: 32, gain: 0, type: 'lowshelf' },
    { freq: 50, gain: 0, type: 'lowshelf' }, // Bass boost
    { freq: 64, gain: 0, type: 'peaking' },
    { freq: 125, gain: 0, type: 'peaking' },
    { freq: 250, gain: 0, type: 'peaking' },
    { freq: 500, gain: 0, type: 'peaking' },
    { freq: 1000, gain: 0, type: 'peaking' },
    { freq: 2000, gain: 0, type: 'peaking' },
    { freq: 3000, gain: 0, type: 'peaking' }, // Presence boost
    { freq: 4000, gain: 0, type: 'peaking' },
    { freq: 6000, gain: 0, type: 'peaking' }, // Presence boost
    { freq: 8000, gain: 0, type: 'peaking' },
    { freq: 12000, gain: 0, type: 'peaking' }, // Air boost
    { freq: 14000, gain: 0, type: 'highshelf' }, // Treble cut
    { freq: 16000, gain: 0, type: 'highshelf' }
]

export const EQ_PRESETS = {
    Club: [0.0, 0.0, 4.8, 3.36, 3.36, 3.36, 1.92, 0.0, 0.0, 0.0],
    Live: [-2.88, 0.0, 2.4, 3.36, 3.36, 3.36, 2.4, 1.44, 1.44, 1.44],
    Party: [4.32, 4.32, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.32, 4.32],
    Pop: [0.96, 2.88, 4.32, 4.8, 3.36, 0.0, -1.44, -1.44, 0.96, 0.96],
    Soft: [2.88, 0.96, 0.0, -1.44, 0.0, 2.4, 4.8, 5.76, 6.72, 7.2],
    Ska: [-1.44, -2.88, -2.4, 0.0, 2.4, 3.36, 5.28, 5.76, 6.72, 5.76],
    Reggae: [0.0, 0.0, 0.0, -3.36, 0.0, 3.84, 3.84, 0.0, 0.0, 0.0],
    Default: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    Rock: [4.8, 2.88, -3.36, -4.8, -1.92, 2.4, 5.28, 6.72, 6.72, 6.72],
    Dance: [5.76, 4.32, 1.44, 0.0, 0.0, -3.36, -4.32, -4.32, 0.0, 0.0],
    Techno: [4.8, 3.36, 0.0, -3.36, -2.88, 0.0, 4.8, 5.76, 5.76, 5.28],
    Headphones: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64],
    SoftRock: [2.4, 2.4, 1.44, 0.0, -2.4, -3.36, -1.92, 0.0, 1.44, 5.28],
    Classical: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -4.32, -4.32, -4.32, -5.76],
    LargeHall: [6.24, 6.24, 3.36, 3.36, 0.0, -2.88, -2.88, -2.88, 0.0, 0.0],
    Bass: [4.8, 5.76, 5.76, 3.36, 0.96, -2.4, -4.8, -6.24, -6.72, -6.72],
    Treble: [-5.76, -5.76, -5.76, -2.4, 1.44, 6.72, 9.6, 9.6, 9.6, 10.08],
    Laptop: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64],
    BassTreble: [4.32, 3.36, 0.0, -4.32, -2.88, 0.96, 4.8, 6.72, 7.2, 7.2],
    VocalBoost: [0.0, 0.0, 2.4, 4.8, 4.8, 2.4, 0.0, -1.2, -1.2, 0.0],
    Acoustic: [1.2, 1.2, 0.0, -1.2, 0.0, 1.2, 2.4, 2.4, 1.2, 0.0],
    Podcast: [0.0, 0.0, 1.2, 2.4, 4.8, 2.4, 0.0, -1.2, -2.4, -3.6],
    BassBoostPlus: [6.0, 6.0, 6.0, 3.6, 0.0, -3.0, -6.0, -7.2, -7.2, -7.2],
    TrebleBoost: [-6.0, -6.0, -6.0, -3.0, 0.0, 3.0, 6.0, 7.2, 7.2, 8.4],
    SmallRoom: [2.0, 1.5, 0.0, -1.5, -2.0, -1.5, 0.0, 1.5, 2.0, 2.5],
    MediumRoom: [1.5, 1.0, 0.0, -1.0, -1.5, -1.0, 0.0, 1.0, 1.5, 2.0],
    LargeRoom: [3.0, 2.0, 0.0, -2.0, -3.0, -2.0, 0.0, 2.0, 3.0, 4.0],
    ConcertHall: [2.5, 2.0, 1.0, 0.0, -1.0, -1.0, 0.0, 2.0, 3.0, 3.5],
    Auditorium: [2.0, 1.5, 0.0, -1.5, -2.0, -1.5, 0.5, 2.0, 2.5, 3.0],
    Outdoor: [3.0, 2.5, 1.5, 0.0, -1.5, -1.5, 0.0, 2.0, 2.5, 3.0]
}

export const eqPresetLabels = Object.keys(EQ_PRESETS)
