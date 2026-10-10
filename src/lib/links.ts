export function empikSearchUrl(title: string, author: string): string {
 const url = new URL('https://www.empik.com/szukaj/produkt')
 url.searchParams.set('q', `${title} ${author}`)
 return url.toString()
}

export function amazonSearchUrl(title: string, author: string): string {
 const url = new URL('https://www.amazon.com/s')
 url.searchParams.set('k', `${title} ${author}`)
 return url.toString()
}
