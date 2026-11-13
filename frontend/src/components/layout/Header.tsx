import { TruckIcon } from '../common/Icons'

export default function Header() {
    return (
        <header className="bg-slate-900 shadow">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <TruckIcon className="h-6 w-6" />
        </span>
                <div>
                    <h1 className="text-lg font-semibold leading-tight text-white">
                        CargoMind <span className="text-emerald-400">AI</span>
                    </h1>
                    <p className="text-xs text-slate-400">Ghost Cargo Engine · no more empty return trips</p>
                </div>
            </div>
        </header>
    )
}