import ErrorAlert from './components/common/ErrorAlert'
import Header from './components/layout/Header'
import ResultsList from './components/results/ResultsList'
import SearchForm from './components/search/SearchForm'
import { useCargoSearch } from './hooks/useCargoSearch'
import { useCities } from './hooks/useCities'

function App() {
    const { cities, error: citiesError } = useCities()
    const { results, loading, error: searchError, search } = useCargoSearch()

    const error = searchError ?? citiesError

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Header />

            <main className="mx-auto max-w-5xl space-y-6 p-8">
                {cities && <SearchForm cities={cities} loading={loading} onSearch={search} />}
                {!cities && !error && <p className="text-slate-500">Loading data…</p>}
                {error && <ErrorAlert message={error} />}
                {results && <ResultsList results={results} />}
            </main>
        </div>
    )
}

export default App