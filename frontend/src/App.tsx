import { useState } from 'react'
import ErrorAlert from './components/common/ErrorAlert'
import Spinner from './components/common/Spinner'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import type { Tab } from './components/layout/TabNav'
import OffersPage from './components/offers/OffersPage'
import SearchPage from './components/search/SearchPage'
import { useCities } from './hooks/useCities'

function App() {
    const [tab, setTab] = useState<Tab>('search')
    const { cities, error } = useCities()

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Header />
            <TabNav active={tab} onChange={setTab} />

            <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-8">
                {error && <ErrorAlert message={error} />}
                {!cities && !error && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Spinner /> Loading data…
                    </div>
                )}

                {cities && (
                    <>
                        <div hidden={tab !== 'search'}>
                            <SearchPage cities={cities} />
                        </div>
                        <div hidden={tab !== 'offers'}>
                            <OffersPage cities={cities} />
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default App