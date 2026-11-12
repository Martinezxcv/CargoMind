import { useState } from 'react'
import ErrorAlert from './components/common/ErrorAlert'
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

            <main className="mx-auto max-w-5xl space-y-6 p-8">
                {error && <ErrorAlert message={error} />}
                {!cities && !error && <p className="text-slate-500">Loading data…</p>}

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