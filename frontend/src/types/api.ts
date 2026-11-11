// RFC 9457 problem response produced by the backend GlobalExceptionHandler
export interface ProblemDetail {
    detail?: string
    errors?: Record<string, string>
}