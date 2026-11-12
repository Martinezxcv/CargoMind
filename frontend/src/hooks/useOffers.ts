import { useEffect, useState } from 'react'
import { createOffer, deleteOffer, fetchOffers, updateOffer } from '../api/offerApi'
import type { CargoOffer, CargoOfferInput } from '../types/offer'
import { getErrorMessage } from '../utils/errors'

export function useOffers() {
    const [offers, setOffers] = useState<CargoOffer[] | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false // guards against state updates after unmount
        fetchOffers()
            .then((data) => {
                if (!ignore) setOffers(data)
            })
            .catch((e: unknown) => {
                if (!ignore) setError(`Could not load offers: ${getErrorMessage(e)}`)
            })
        return () => {
            ignore = true
        }
    }, [])

    // Runs a mutation, then reloads the list so ordering always matches the server.
    // Returns true on success so the caller can close its form.
    const mutate = async (action: () => Promise<unknown>): Promise<boolean> => {
        setSaving(true)
        setError(null)
        try {
            await action()
            setOffers(await fetchOffers())
            return true
        } catch (e) {
            setError(getErrorMessage(e))
            return false
        } finally {
            setSaving(false)
        }
    }

    return {
        offers,
        saving,
        error,
        create: (input: CargoOfferInput) => mutate(() => createOffer(input)),
        update: (id: number, input: CargoOfferInput) => mutate(() => updateOffer(id, input)),
        remove: (id: number) => mutate(() => deleteOffer(id)),
    }
}