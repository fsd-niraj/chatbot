import axios from 'axios'
import { notify } from './notifications'
import { getToken, clearToken } from './auth'

// NEXT_PUBLIC_API_URL should be the backend host, e.g. http://localhost:3001
// ENDPOINTS from @chatbot/shared include the full /api/v1/... path
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function getErrorMessage(status: number, serverMessage?: string): string {
  if (serverMessage) return serverMessage
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'A conflict occurred. The resource may already exist.'
    case 422:
      return 'Validation failed. Please check your input.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'An internal server error occurred. Please try again later.'
    case 502:
      return 'Bad gateway. The server is temporarily unreachable.'
    case 503:
      return 'Service unavailable. Please try again later.'
    default:
      return 'An unexpected error occurred.'
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window === 'undefined') return Promise.reject(error)

    if (!error.response) {
      notify.error('Unable to reach the server. Please check your connection.', { title: 'Network Error' })
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const serverMessage: string | undefined = data?.error?.message ?? data?.message

    if (status === 401) {
      clearToken()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    notify.error(getErrorMessage(status, serverMessage), {
      title: status >= 500 ? 'Server Error' : 'Request Failed',
    })

    return Promise.reject(error)
  }
)

export default api
