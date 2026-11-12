import ErrorAlert from '../common/ErrorAlert'
import ResultsList from '../results/ResultsList'
import SearchForm from './SearchForm'
import { useCargoSearch } from '../../hooks/useCargoSearch'
import type { City } from '../../types/city'

interface SearchPageProps {
    cities: City[]
}

export default function SearchPage({ cities }: SearchPageProps) {
    const { results, loading, error, search } = useCargoSearch()

    return (
        <div className="space-y-6">
            <SearchForm cities={cities} loading={loading} onSearch={search} />
            {error && <ErrorAlert message={error} />}
            {results && <ResultsList results={results} />}
        </div>
    )
}