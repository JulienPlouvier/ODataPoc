const api = "https://localhost:5001/odata/"


export function get<T>(path: string) {
    return handleFetch(path, { method: 'get', headers: {} }) as Promise<T>
}

function handleFetch(path: string, input: any) {
    let isOfflineResponse = json => json && json.status === "Offline"


    async function makeRequest() {
        input.headers = { 'X-Auth': "" }
        if (!input.noContentType)
            input.headers['content-type'] = 'application/json'

        try {
            let response = await fetch(api + path, input)
            if (response.status < 100 || response.status >= 400)
                throw { status: response.status }
            let json = await response.json().catch(_ => { })
            if (isOfflineResponse(json)) throw { status: 0, statusText: 'Offline' }
            return json
        }
        catch (e) {
            console.log(e)
            return ''
        }
    }

    return makeRequest()
}