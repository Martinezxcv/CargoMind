import { API_URL } from '../config/env'
import type { ProblemDetail } from '../types/api'

export class ApiError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

// Turns an error response into a readable message (field errors > detail > status code)
async function toApiError(response: Response): Promise<ApiError> {
    let message = `Server responded with ${response.status}`
    try {
        const problem = (await response.json()) as ProblemDetail
        if (problem.errors) {
            message = Object.values(problem.errors).join('; ')
        } else if (problem.detail) {
            message = problem.detail
        }
    } catch {
        // body is not JSON - keep the generic message
    }
    return new ApiError(message, response.status)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    try {
        const response = await fetch(`${API_URL}${path}`, init)
        if (!response.ok) {
            throw await toApiError(response)
        }
        if (response.status === 204) {
            return undefined as T // DELETE returns no body
        }
        return (await response.json()) as T
    } catch (error) {
        console.error(`API call ${path} failed:`, error)
        // fetch() rejects with TypeError when the server is unreachable
        if (error instanceof TypeError) {
            throw new ApiError('Cannot reach the server. Is the backend running?', 0)
        }
        throw error
    }
}

function withJsonBody<B>(method: 'POST' | 'PUT', body: B): RequestInit {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }
}

export const http = {
    get: <T>(path: string): Promise<T> => request<T>(path),
    post: <T, B>(path: string, body: B): Promise<T> => request<T>(path, withJsonBody('POST', body)),
    put: <T, B>(path: string, body: B): Promise<T> => request<T>(path, withJsonBody('PUT', body)),
    delete: (path: string): Promise<void> => request<void>(path, { method: 'DELETE' }),
}