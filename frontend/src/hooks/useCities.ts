import { useEffect, useState } from 'react'
import { fetchCities } from '../api/cityApi'
import type { City } from '../types/city'
import { getErrorMessage } from '../utils/errors'

export function useCities() {
    const [cities, setCities] = useState<City[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false // guards against state updates after unmount
        fetchCities()
            .then((data) => {
                if (!ignore) setCities(data)
            })
            .catch((e: unknown) => {
                if (!ignore) setError(`Could not load cities: ${getErrorMessage(e)}`)
            })
        return () => {
            ignore = true
        }
    }, [])

    return { cities, error }
}