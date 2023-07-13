class Skip {
    #store = null

    constructor(store) {
        this.#store = store 
    }

    get #trackRows() {
        const parent = document.querySelector('[data-testid="track-list"]')
        const trackRows = parent?.querySelector(
            '[data-testid="top-sentinel"] + [role="presentation"]'
        ).children
        
        return trackRows?.length > 0 ? Array.from(trackRows) : undefined
    }

    #setEvent({ events, row }) {
        const visibleEvents = ['focus', 'mouseenter']

        events.forEach(event => {
            row.addEventListener(event, () => {
                const { id } = this.#songInfo(row)
                const { isSkipped } = this.#store.getTrack({ id })
                const skipIcon = row.querySelector('button[role="blocker"]')            

                skipIcon.style.visibility = visibleEvents.includes(event) ? 'visible' : 'hidden'
                this.#setHighlighted({ isSkipped, skipIcon })
            })
        })
    }

    #setRowEvents(rows) {
        rows.forEach(row => {
            this.#insertBlockUI(row)
            this.#setSkipIconEvents(row)
            this.#setEvent({ 
                row, 
                events: ['focus', 'blur', 'mouseenter', 'mouseleave']
            })
        }) 
    }

    #setSkipIconEvents(row) {
        const skipIcon = row.querySelector('button[role="blocker"]')            

        skipIcon.addEventListener('click', async() => {
            const { id } = this.#songInfo(row)
            const response = this.#store.getTrack({ id })

            const { isSkipped } = await this.#store.saveTrack({ 
                id,
                value: { ...response, isSkipped: !response.isSkipped }
            })

            this.#setHighlighted({ isSkipped, skipIcon  })
            this.#glowIcon({ isSkipped, skipIcon })
        })
    }

    #insertBlockUI(row) {
        const lastGridChild = Array.from(row.children).at(-1)
        if (!lastGridChild) return

        const heartSection = Array.from(lastGridChild?.children).at(-1)
        if (!heartSection) return

        const heartIcon = Array.from(heartSection.children).at(0)

        const skipIconCheck = row.querySelector('button[role="blocker"]')            

        if (!skipIconCheck) {
            heartIcon.insertAdjacentHTML('beforebegin', this.#iconUI)
        }

        const skipIcon = row.querySelector('button[role="blocker"]')

        const { id, endTime } = this.#songInfo(row)
        const { isSkipped } = this.#store.getTrack({ 
            id,
            value: { isSkipped: false, isSnip: false, startTime: 0, endTime }
        })

        this.#setHighlighted({ isSkipped, skipIcon })
        this.#glowIcon({ isSkipped, skipIcon })
    }

    setUpBlocking() {
        const trackRows = this.#trackRows
        if (!trackRows) return
        this.#setRowEvents(trackRows)
    }

    #getArtists(row) {
        const artistsList = row.querySelectorAll('span > a')

        if (!artistsList.length) {
            // Here means we are at artist page and can get name from h1
            return document.querySelector('span[data-testid="entityTitle"] > h1').textContent
        }

        return Array.from(artistsList)
            .filter(artist => artist.href.includes('artist'))
            .map(artist => artist.textContent)
            .join(', ')
    }

    #songInfo(row) {
        const song = row.querySelector('a > div').textContent
        const songLength = row.querySelector('button[data-testid="add-button"] + div').textContent
        const artists = this.#getArtists(row)

        return {
            id:  `${song} by ${artists}`,
            endTime: timeToSeconds(songLength)
        }
    }

    #setHighlighted({ skipIcon, isSkipped }) {
        const svg = skipIcon.querySelector('svg')
        if (isSkipped) {
            skipIcon.style.visibility = 'visible'
            skipIcon.setAttribute('aria-label', 'Unskip Song')
        }
        svg.style.fill = isSkipped ? '#1ed760' : 'currentColor'
    }

    #glowIcon({ skipIcon, isSkipped }) {
        const svg = skipIcon.querySelector('svg')

        svg.addEventListener('mouseover', () => {
            svg.style.fill = isSkipped ? '#1ed760' : '#fff'
        })
        svg.addEventListener('mouseleave', () => {
            svg.style.fill = isSkipped ? '#1ed760' : 'currentColor'
        })
    }

    get #iconUI() {
        return `
            <button 
                type="button"
                role="blocker"
                aria-label="Skip Song"
                style="visibility:hidden;border:none;background:none;display:flex;align-items:center;"
            >
                <svg 
                    role="img"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fill-rule="evenodd" d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z" clip-rule="evenodd" />
                </svg>
            </button>
        `
    }
}
