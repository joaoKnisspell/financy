const TOKEN_KEY = "financy:token"
export const UNAUTHORIZED_EVENT = "financy:unauthorized"

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}

export function notifyUnauthorized(): void {
    clearToken()
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}
