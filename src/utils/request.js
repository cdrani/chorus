export const setOptions = ({ method = 'GET', body = null }) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('auth_token'),
    },
    body: body ? JSON.stringify(body) : null
})

export const request = async ({ url, options, cb = null }) => {
    try {
        const response = await fetch(url, options || setOptions())

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        return (await response.json())
    } catch (error) {
        console.error('Problem with data request: ', error)
        throw error
    } finally {
        if (cb) await cb()
    }
}
