import { books, type Book } from './books'

// Jedno miejsce do zastąpienia lokalnego katalogu przyszłym wywołaniem API.
export async function loadBooks(): Promise<Book[]> {
 return Promise.resolve(books)
}
