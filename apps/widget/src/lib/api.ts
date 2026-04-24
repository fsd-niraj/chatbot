let _apiKey = ''
let _baseUrl: string = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'

export function configure(apiKey: string, baseUrl?: string) {
  _apiKey = apiKey
  if (baseUrl) _baseUrl = baseUrl
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${_baseUrl}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': _apiKey,
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err?.error?.message ?? err?.message ?? 'Request failed')
  }
  return res.json() as Promise<T>
}
