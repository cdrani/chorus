import { setOptions, request } from '../utils/request.js'

const API_URLS = {
    base: 'https://api.spotify.com/v1',
    player: 'https://api.spotify.com/v1/me/player' 
} 

async function makeRequest({ endpoint, type = 'base', params = {} }) {
    const options = await setOptions(params)
    const url = `${API_URLS[type]}${endpoint}`
    return await request({ url, options })
}

async function handleRequest(requestFunction, params) {
    try { return await requestFunction(params) }
    catch (error) { throw error }
}

export { makeRequest, handleRequest }
