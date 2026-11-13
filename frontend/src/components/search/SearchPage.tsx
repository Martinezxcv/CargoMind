import { useCargoSearch } from '../../hooks/useCargoSearch'
import type { City } from '../../types/city'
import EmptyState from '../common/EmptyState'
import ErrorAlert from '../common/ErrorAlert'
import { TruckIcon } from '../common/Icons'
import ResultsList from '../results/ResultsList'
import ResultsSkeleton from '../results/ResultsSkeleton'
import SearchForm from './SearchForm'

interface SearchPageProps {
    cities: City[]
}

export default function SearchPage({ cities }: SearchPageProps) {
    const { results, loading, error, search } = useCargoSearch()

    return (
        <div className="space-y-6">
            <SearchForm cities={cities} loading={loading} onSearch={search} />
            {error && <ErrorAlert message={error} />}

            {loading ? (
                <ResultsSkeleton />
            ) : results ? (
                <ResultsList results={results} />
            ) : (
                !error && (
                    <EmptyState
                        icon={<TruckIcon className="h-6 w-6" />}
                        title="Ready when you are"
                        description="Pick your location, home base and vehicle, then search for the best return cargo."
                    />
                )
            )}
        </div>
    )
}