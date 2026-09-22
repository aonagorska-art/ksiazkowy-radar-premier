export const monthNames = ['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień']
export const monthGenitive = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia']
export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
export const formatDate = (iso: string) => { const d = new Date(`${iso}T12:00:00`); return `${d.getDate()} ${monthGenitive[d.getMonth()]} ${d.getFullYear()}` }
export const monthLabel = (year: number, month: number) => `${monthNames[month]} ${year}`
export const offsetMonth = (year: number, month: number, offset: number) => { const d = new Date(year, month + offset, 1); return { year:d.getFullYear(), month:d.getMonth() } }
export const daysUntil = (iso: string) => { const d = new Date(`${iso}T12:00:00`); const now = new Date(); return Math.round((d.getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate(),12).getTime())/86400000) }
