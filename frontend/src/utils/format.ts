const eur = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })
const num = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 })

export const formatEur = (value: number): string => eur.format(value)
export const formatNumber = (value: number): string => num.format(value)

// Local date as YYYY-MM-DD (toISOString() would shift the day because it uses UTC)
export function todayIso(): string {
    const d = new Date()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
}

// "BERLIN" -> "Berlin"
export function titleCase(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase()
}