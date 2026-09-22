import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, List, Heart } from 'lucide-react'
import { type Book } from './data/books'
import { loadBooks } from './data/bookService'
import { monthNames, monthLabel, offsetMonth, daysUntil } from './lib/date'
import { readStored, saveStored } from './lib/storage'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { UpcomingReleases } from './components/UpcomingReleases'
import { SearchBox, Filters, FilterChips, type FiltersState } from './components/Filters'
import { Calendar } from './components/Calendar'
import { ReleaseList, type SortOrder } from './components/ReleaseList'
import { EmptyState, ErrorState, Skeleton } from './components/States'
import { BookModal } from './components/BookModal'
import { Footer } from './components/Footer'
import './style.css'
import './redesign.css'

type View = 'calendar'|'list'
const defaultFilters: FiltersState = {query:'',publishers:[],genres:[],range:'all',favoritesOnly:false}
const now = new Date()
const initialMonth = {year:now.getFullYear(),month:now.getMonth()}
function App() {
 const [books,setBooks]=useState<Book[]>([])
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading')
 const [retryKey,setRetryKey]=useState(0)
 const [selected,setSelected]=useState(()=>readStored('krp-month',initialMonth))
 const [view,setView]=useState<View>(()=>readStored('krp-view-v2','calendar'))
 const [filters,setFilters]=useState<FiltersState>(()=>readStored('krp-filters-v3',defaultFilters))
 const [favorites,setFavorites]=useState<string[]>(()=>readStored('krp-favorites-v3',[]))
 const [modalBook,setModalBook]=useState<Book|null>(null)
 const [filtersOpen,setFiltersOpen]=useState(false)
 const [sort,setSort]=useState<SortOrder>('soon')
 const closeModal=useCallback(()=>setModalBook(null),[])
 useEffect(()=>{let active=true;loadBooks().then(items=>{if(active){setBooks(items);setStatus('ready')}}).catch(()=>{if(active)setStatus('error')});return()=>{active=false}},[retryKey])
 useEffect(()=>saveStored('krp-month',selected),[selected])
 useEffect(()=>saveStored('krp-view-v2',view),[view])
 useEffect(()=>saveStored('krp-filters-v3',filters),[filters])
 useEffect(()=>saveStored('krp-favorites-v3',favorites),[favorites])
 const toggleFavorite=(id:string)=>setFavorites(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])
 const monthBooks=useMemo(()=>books.filter(book=>{const d=new Date(`${book.releaseDate}T12:00:00`);return d.getFullYear()===selected.year&&d.getMonth()===selected.month}),[selected,books])
 const filtered=useMemo(()=>monthBooks.filter(book=>{
  const q=filters.query.trim().toLocaleLowerCase('pl');const day=daysUntil(book.releaseDate)
  return (!q||[book.title,book.author,book.publisher].some(x=>x.toLocaleLowerCase('pl').includes(q)))&&(!filters.publishers.length||filters.publishers.includes(book.publisher))&&(!filters.genres.length||filters.genres.includes(book.genre))&&(filters.range==='all'||(filters.range==='today'?day===0:filters.range==='week'?day>=0&&day<7:day>=0&&day<=30))&&(!filters.favoritesOnly||favorites.includes(book.id))
 }),[monthBooks,filters,favorites])
 const upcoming=useMemo(()=>books.filter(book=>daysUntil(book.releaseDate)>=0).sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate)),[books])
 const weekCount=upcoming.filter(book=>daysUntil(book.releaseDate)<7).length
 const publisherCount=new Set(books.map(book=>book.publisher)).size
 const emptyType=monthBooks.length===0?'month':filters.query?'search':'filter'
 const changeMonth=(delta:number)=>setSelected(current=>offsetMonth(current.year,current.month,delta))
 const openFavorites=()=>{setFilters(current=>({...current,favoritesOnly:true}));document.getElementById('kalendarz')?.scrollIntoView({behavior:'smooth'})}
 return <><Header favoritesCount={favorites.length} onFavorites={openFavorites}/><main><div className="top-content"><Hero monthlyCount={monthBooks.length}/><Stats monthCount={monthBooks.length} weekCount={weekCount} publisherCount={publisherCount}/></div>{status==='loading'?<section className="upcoming section-wrap"><div className="section-heading"><div><p className="eyebrow">Na horyzoncie</p><h2>Najbliższe premiery</h2></div></div><Skeleton variant="cards"/></section>:status==='error'?<section className="upcoming section-wrap"><ErrorState onRetry={()=>{setStatus('loading');setRetryKey(v=>v+1)}}/></section>:<UpcomingReleases books={upcoming} onOpen={setModalBook} favorites={favorites} onToggleFavorite={toggleFavorite}/>}<section className="calendar-section section-wrap" id="kalendarz"><div className="section-heading calendar-heading"><div><p className="eyebrow">Zajrzyj w przyszłość</p><h2>Kalendarz premier</h2></div><span className="demo-label">Dane z kart wydawców · stan na 22.09.2026</span></div><div className="workspace"><div className="workspace-search"><SearchBox value={filters.query} onChange={query=>setFilters({...filters,query})} resultCount={filtered.length}/></div><Filters filters={filters} onChange={setFilters} onClear={()=>setFilters(defaultFilters)} open={filtersOpen} onClose={()=>setFiltersOpen(v=>!v)}/><div className="workspace-main"><div className="calendar-toolbar"><div className="month-navigation"><button onClick={()=>changeMonth(-1)} aria-label="Poprzedni miesiąc"><ArrowLeft size={18}/></button><h3 aria-live="polite">{monthLabel(selected.year,selected.month)}</h3><button onClick={()=>changeMonth(1)} aria-label="Następny miesiąc"><ArrowRight size={18}/></button></div><div className="calendar-controls"><label className="visually-hidden" htmlFor="month-select">Miesiąc</label><select id="month-select" value={selected.month} onChange={e=>setSelected({...selected,month:Number(e.target.value)})}>{monthNames.map((month,i)=><option value={i} key={month}>{month[0].toUpperCase()+month.slice(1)}</option>)}</select><label className="visually-hidden" htmlFor="year-select">Rok</label><select id="year-select" value={selected.year} onChange={e=>setSelected({...selected,year:Number(e.target.value)})}>{Array.from({length:7},(_,i)=>now.getFullYear()-2+i).map(year=><option key={year}>{year}</option>)}</select><button className="today-button" onClick={()=>setSelected(initialMonth)}>Dzisiaj</button></div></div><div className="results-bar"><span>Pokazujesz <strong>{filtered.length} z {monthBooks.length}</strong> premier</span><div className="view-toggle" role="group" aria-label="Widok premier"><button className={view==='calendar'?'active':''} onClick={()=>setView('calendar')} aria-pressed={view==='calendar'}><CalendarDays size={16}/> Kalendarz</button><button className={view==='list'?'active':''} onClick={()=>setView('list')} aria-pressed={view==='list'}><List size={16}/> Lista</button></div></div><FilterChips filters={filters} onChange={setFilters} onClear={()=>setFilters(defaultFilters)}/><button className={`favorites-filter ${filters.favoritesOnly?'active':''}`} onClick={()=>setFilters({...filters,favoritesOnly:!filters.favoritesOnly})} aria-pressed={filters.favoritesOnly}><Heart size={16} fill={filters.favoritesOnly?'currentColor':'none'}/> Tylko ulubione</button>{status==='loading'?<Skeleton variant={view==='calendar'?'calendar':'cards'}/>:status==='error'?<ErrorState onRetry={()=>{setStatus('loading');setRetryKey(v=>v+1)}}/>:filtered.length===0?<EmptyState type={emptyType}/>:view==='calendar'?<Calendar year={selected.year} month={selected.month} books={filtered} onOpen={setModalBook}/>:<ReleaseList books={filtered} sort={sort} onSort={setSort} onOpen={setModalBook} favorites={favorites} onToggleFavorite={toggleFavorite}/>}</div></div></section></main><Footer/><BookModal book={modalBook} onClose={closeModal} isFavorite={!!modalBook&&favorites.includes(modalBook.id)} onToggleFavorite={toggleFavorite}/></>
}
export default App
