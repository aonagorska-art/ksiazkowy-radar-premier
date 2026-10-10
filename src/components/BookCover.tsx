import { BookOpen } from 'lucide-react'
import { genreClass, type Book } from '../data/books'
import { genreLabel, type Language } from '../i18n'

type BookCoverProps = {
 book: Book
 language: Language
 compact?: boolean
}

export function BookCover({book,language,compact=false}:BookCoverProps){
 const en=language==='en'
 return <div
  className={`book-art ${genreClass(book.genre)}${compact?' book-art-compact':''}`}
  role="img"
  aria-label={en?`Original placeholder artwork for ${book.title}`:`Autorska grafika zastępcza książki ${book.title}`}
 >
  <span className="book-art-series">{en?'Book Release Radar':'Książkowy Radar'}</span>
  <span className="book-art-genre">{genreLabel(book.genre,language)}</span>
  <strong>{book.title}</strong>
  <span className="book-art-author">{book.author}</span>
  <span className="book-art-icon" aria-hidden="true"><BookOpen/></span>
 </div>
}
