import { books, type Book } from './books'

async function readCatalog(path: string): Promise<Book[]> {
 try {
  const response = await fetch(path, { cache: 'no-store' })
  return response.ok ? await response.json() as Book[] : []
 } catch { return [] }
}

export async function loadBooks(language: 'pl'|'en' = 'pl'): Promise<Book[]> {
 if (language === 'en') return readCatalog('/data/us-books.json')
 try {
  const [backfill, discovered] = await Promise.all([
   readCatalog('/data/pl-books-2026.json'),
   readCatalog('/data/auto-books.json'),
  ])
  const manualUrls = new Set(books.map(book => book.publisherUrl.replace(/\/$/, '')))
  const manualKeys = new Set(books.map(book => `${book.title}|${book.author}`.toLocaleLowerCase('pl-PL')))
  const curated = backfill.filter(book => {
   const key = `${book.title}|${book.author}`.toLocaleLowerCase('pl-PL')
   return !manualUrls.has(book.publisherUrl.replace(/\/$/, '')) && !manualKeys.has(key)
  })
  const knownUrls = new Set([...books, ...curated].map(book => book.publisherUrl.replace(/\/$/, '')))
  const knownKeys = new Set([...books, ...curated].map(book => `${book.title}|${book.author}`.toLocaleLowerCase('pl-PL')))
  const unique = discovered.filter(book => !knownUrls.has(book.publisherUrl.replace(/\/$/, '')) && !knownKeys.has(`${book.title}|${book.author}`.toLocaleLowerCase('pl-PL')))
  return [...books, ...curated, ...unique]
 } catch { return books }
}
