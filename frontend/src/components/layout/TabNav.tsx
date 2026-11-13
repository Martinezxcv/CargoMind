export type Tab = 'search' | 'offers'

interface TabNavProps {
    active: Tab
    onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
    { id: 'search', label: 'Find cargo' },
    { id: 'offers', label: 'My offers' },
]

export default function TabNav({ active, onChange }: TabNavProps) {
    return (
        <nav className="border-b border-slate-200 bg-white" aria-label="Main">
            <div className="mx-auto flex max-w-5xl gap-6 px-4 sm:px-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        aria-current={active === tab.id ? 'page' : undefined}
                        className={`-mb-px border-b-2 py-3 text-sm font-medium transition focus:outline-none
                        focus-visible:text-emerald-700 ${
                            active === tab.id
                                ? 'border-emerald-500 text-slate-900'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}