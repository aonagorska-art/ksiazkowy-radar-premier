import { useState } from 'react'
import type { Book } from '../data/books'
import { dateKey, formatDate } from '../lib/date'

type CalendarProps = {
 year: number
 month: number
 books: Book[]
 onOpen: (book: Book) => void
}

function CalendarEvent({ book, onOpen }: { book: Book; onOpen: (book: Book) => void }) {
 return (
  <button
   className="calendar-event"
   type="button"
   onClick={() => onOpen(book)}
   aria-label={`${book.title}, ${book.author}. Otwórz szczegóły książki`}
  >
   <span className="event-title">{book.title}</span>
   <span className="event-tooltip" aria-hidden="true">
    <img src={book.cover} alt="" />
    <span className="event-tooltip-copy">
     <strong>{book.title}</strong>
     <span>{book.author}</span>
     <span>{book.publisher}</span>
     <span>{book.genre} · {formatDate(book.releaseDate)}</span>
     <em>Kliknij, aby zobaczyć więcej</em>
    </span>
   </span>
  </button>
 )
}

function CalendarDay({ day, year, month, books, onOpen, column }: {
 day: number
 year: number
 month: number
 books: Book[]
 onOpen: (book: Book) => void
 column: number
}) {
 const iso = dateKey(new Date(year, month, day))
 const today = dateKey(new Date())
 const dayBooks = books.filter(book => book.releaseDate === iso)
 const [showAll, setShowAll] = useState(false)
 const visibleBooks = showAll ? dayBooks : dayBooks.slice(0, 3)
 const releaseWord = dayBooks.length === 1 ? 'premiera' : dayBooks.length >= 2 && dayBooks.length <= 4 ? 'premiery' : 'premier'
 return (
  <div
   className={`calendar-day ${column >= 5 ? 'weekend' : ''} ${iso === today ? 'today' : ''} ${iso < today ? 'past' : ''}`}
   role="gridcell"
   aria-label={`${day}. dzień miesiąca, ${dayBooks.length} ${releaseWord}`}
  >
   <span className="day-number">{day}{iso === today && <i>dziś</i>}</span>
   <div className="day-books">
    {visibleBooks.map(book => <CalendarEvent key={book.id} book={book} onOpen={onOpen} />)}
    {dayBooks.length > 3 && <button className="day-more" type="button" aria-expanded={showAll} onClick={() => setShowAll(value => !value)}>{showAll ? 'Pokaż mniej' : `+ ${dayBooks.length - 3} więcej`}</button>}
   </div>
  </div>
 )
}

export function Calendar({ year, month, books, onOpen }: CalendarProps) {
 const first = (new Date(year, month, 1).getDay() + 6) % 7
 const days = new Date(year, month + 1, 0).getDate()
 const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, i) => i - first + 1)
 return (
  <div className="calendar-wrap">
   <p className="calendar-scroll-hint">Przesuń kalendarz w bok, aby zobaczyć cały tydzień →</p>
   <div className="calendar" role="grid" aria-label={`Kalendarz premier na ${month + 1}.${year}`}>
    <div className="calendar-weekdays" role="row">
     {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map(day => <div role="columnheader" key={day}>{day}</div>)}
    </div>
    <div className="calendar-cells">
     {cells.map((day, i) => day < 1 || day > days
      ? <div className="calendar-day outside" key={i} aria-hidden="true" />
      : <CalendarDay key={`${year}-${month}-${day}`} day={day} year={year} month={month} books={books} onOpen={onOpen} column={i % 7} />)}
    </div>
   </div>
  </div>
 )
}
