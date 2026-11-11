import { useCallback, useState } from 'react'
import { searchCargo } from '../api/cargoApi'
import type { CargoOfferResult, CargoSearchRequest } from '../types/cargo'
import { getErrorMessage } from '../utils/errors'

export function useCargoSearch() {
    const [results, setResults] = useState<CargoOfferResult[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (request: CargoSearchRequest) => {
        setLoading(true)
        setError(null)
        try {
            setResults(await searchCargo(request))
        } catch (e) {
            setResults(null)
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    return { results, loading, error, search }
}