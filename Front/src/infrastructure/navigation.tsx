import { createBrowserHistory, LocationDescriptorObject } from 'history'

export const history = createBrowserHistory()

export function navigateTo(path: string) {
    history.push(path)
}

export function navigateBack() {
    history.goBack()
}
