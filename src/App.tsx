import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, List, Heart } from 'lucide-react'
import { type Book } from './data/books'
import { loadBooks } from './data/bookService'
import { syncStatus } from './data/syncStatus'
import { monthNames, monthNamesEn, monthLabel, offsetMonth, daysUntil } from './lib/date'
import { readStored, saveStored } from './lib/storage'
import { appName, localeFor, type Language } from './i18n'
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

type View='calendar'|'list'
const defaultFilters:FiltersState={query:'',publishers:[],genres:[],range:'all',favoritesOnly:false}
const now=new Date()
const initialMonth={year:now.getFullYear(),month:now.getMonth()}

function App(){
 const [language,setLanguage]=useState<Language>(()=>readStored('krp-language','pl'))
 const [books,setBooks]=useState<Book[]>([])
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading')
 const [retryKey,setRetryKey]=useState(0)
 const [selected,setSelected]=useState(()=>readStored('krp-month',initialMonth))
 const [view,setView]=useState<View>(()=>readStored('krp-view-v2','calendar'))
 const [filters,setFilters]=useState<FiltersState>(defaultFilters)
 const [favorites,setFavorites]=useState<string[]>(()=>readStored('krp-favorites-v3',[]))
 const [modalBook,setModalBook]=useState<Book|null>(null)
 const [filtersOpen,setFiltersOpen]=useState(false)
 const [sort,setSort]=useState<SortOrder>('soon')
 const en=language==='en'
 const closeModal=useCallback(()=>setModalBook(null),[])

 useEffect(()=>{let active=true;setStatus('loading');loadBooks(language).then(items=>{if(active){setBooks(items);setStatus('ready')}}).catch(()=>{if(active)setStatus('error')});return()=>{active=false}},[retryKey,language])
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dataset.language=language;document.title=appName(language);saveStored('krp-language',language)},[language])
 useEffect(()=>saveStored('krp-month',selected),[selected])
 useEffect(()=>saveStored('krp-view-v2',view),[view])
 useEffect(()=>saveStored('krp-favorites-v3',favorites),[favorites])

 const changeLanguage=(next:Language)=>{setLanguage(next);setFilters(defaultFilters);setModalBook(null)}
 const toggleFavorite=(id:string)=>setFavorites(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])
 const monthBooks=useMemo(()=>books.filter(book=>{const d=new Date(`${book.releaseDate}T12:00:00`);return d.getFullYear()===selected.year&&d.getMonth()===selected.month}),[selected,books])
 const filtered=useMemo(()=>monthBooks.filter(book=>{const q=filters.query.trim().toLocaleLowerCase(localeFor(language));const day=daysUntil(book.releaseDate);return (!q||[book.title,book.author,book.publisher].some(x=>x.toLocaleLowerCase(localeFor(language)).includes(q)))&&(!filters.publishers.length||filters.publishers.includes(book.publisher))&&(!filters.genres.length||filters.genres.includes(book.genre))&&(filters.range==='all'||(filters.range==='today'?day===0:filters.range==='week'?day>=0&&day<7:day>=0&&day<=30))&&(!filters.favoritesOnly||favorites.includes(book.id))}),[monthBooks,filters,favorites,language])
 const upcoming=useMemo(()=>books.filter(book=>daysUntil(book.releaseDate)>=0).sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate)),[books])
 const availablePublishers=useMemo(()=>[...new Set(books.map(book=>book.publisher))].sort((a,b)=>a.localeCompare(b,localeFor(language))),[books,language])
 const weekCount=upcoming.filter(book=>daysUntil(book.releaseDate)<7).length
 const publisherCount=availablePublishers.length
 const emptyType=monthBooks.length===0?'month':filters.query?'search':'filter'
 const changeMonth=(delta:number)=>setSelected(current=>offsetMonth(current.year,current.month,delta))
 const openFavorites=()=>{setFilters(current=>({...current,favoritesOnly:true}));document.getElementById('kalendarz')?.scrollIntoView({behavior:'smooth'})}
 const verifiedDate=en?new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(`${syncStatus.updatedAt}T12:00:00`)):syncStatus.updatedAt.split('-').reverse().join('.')
 const retry=()=>{setStatus('loading');setRetryKey(v=>v+1)}
 const months=en?monthNamesEn:monthNames

 return <><Header favoritesCount={favorites.length} onFavorites={openFavorites} language={language} onLanguage={changeLanguage}/><main><div className="top-content"><Hero monthlyCount={monthBooks.length} language={language}/><Stats monthCount={monthBooks.length} weekCount={weekCount} publisherCount={publisherCount} language={language}/></div>{status==='loading'?<section className="upcoming section-wrap"><div className="section-heading"><div><p className="eyebrow">{en?'On the horizon':'Na horyzoncie'}</p><h2>{en?'Upcoming releases':'Najbliższe premiery'}</h2></div></div><Skeleton variant="cards" language={language}/></section>:status==='error'?<section className="upcoming section-wrap"><ErrorState onRetry={retry} language={language}/></section>:<UpcomingReleases books={upcoming} onOpen={setModalBook} favorites={favorites} onToggleFavorite={toggleFavorite} language={language}/>}<section className="calendar-section section-wrap" id="kalendarz"><div className="section-heading calendar-heading"><div><p className="eyebrow">{en?'Plan your reading':'Zajrzyj w przyszłość'}</p><h2>{en?'Release calendar':'Kalendarz premier'}</h2></div><div className="calendar-notes"><span className="demo-label">{en?`Publisher data · automatically checked ${verifiedDate}`:`Dane z kart wydawców · automatycznie sprawdzone ${verifiedDate}`}</span><span className="cover-rights-note">{en?'Due to copyright, real book covers are neither downloaded nor published.':`Ze względu na prawa autorskie rzeczywiste okładki nie są pobierane ani publikowane.`}</span></div></div><div className="workspace"><div className="workspace-search"><SearchBox value={filters.query} onChange={query=>setFilters({...filters,query})} resultCount={filtered.length} language={language}/></div><Filters filters={filters} onChange={setFilters} onClear={()=>setFilters(defaultFilters)} open={filtersOpen} onClose={()=>setFiltersOpen(v=>!v)} publishers={availablePublishers} language={language}/><div className="workspace-main"><div className="calendar-toolbar"><div className="month-navigation"><button onClick={()=>changeMonth(-1)} aria-label={en?'Previous month':'Poprzedni miesiąc'}><ArrowLeft size={18}/></button><h3 aria-live="polite">{monthLabel(selected.year,selected.month,language)}</h3><button onClick={()=>changeMonth(1)} aria-label={en?'Next month':'Następny miesiąc'}><ArrowRight size={18}/></button></div><div className="calendar-controls"><label className="visually-hidden" htmlFor="month-select">{en?'Month':'Miesiąc'}</label><select id="month-select" value={selected.month} onChange={e=>setSelected({...selected,month:Number(e.target.value)})}>{months.map((month,i)=><option value={i} key={month}>{en?month:month[0].toUpperCase()+month.slice(1)}</option>)}</select><label className="visually-hidden" htmlFor="year-select">{en?'Year':'Rok'}</label><select id="year-select" value={selected.year} onChange={e=>setSelected({...selected,year:Number(e.target.value)})}>{Array.from({length:7},(_,i)=>now.getFullYear()-2+i).map(year=><option key={year}>{year}</option>)}</select><button className="today-button" onClick={()=>setSelected(initialMonth)}>{en?'Today':'Dzisiaj'}</button></div></div><div className="results-bar"><span>{en?'Releases':'Premiery'}: <strong>{filtered.length} {en?'of':'z'} {monthBooks.length}</strong></span><div className="view-toggle" role="group" aria-label={en?'Release view':'Widok premier'}><button className={view==='calendar'?'active':''} onClick={()=>setView('calendar')} aria-pressed={view==='calendar'}><CalendarDays size={16}/> {en?'Calendar':'Kalendarz'}</button><button className={view==='list'?'active':''} onClick={()=>setView('list')} aria-pressed={view==='list'}><List size={16}/> {en?'List':'Lista'}</button></div></div><FilterChips filters={filters} onChange={setFilters} onClear={()=>setFilters(defaultFilters)} language={language}/><button className={`favorites-filter ${filters.favoritesOnly?'active':''}`} onClick={()=>setFilters({...filters,favoritesOnly:!filters.favoritesOnly})} aria-pressed={filters.favoritesOnly}><Heart size={16} fill={filters.favoritesOnly?'currentColor':'none'}/> {en?'Favorites only':'Tylko ulubione'}</button>{status==='loading'?<Skeleton variant={view==='calendar'?'calendar':'cards'} language={language}/>:status==='error'?<ErrorState onRetry={retry} language={language}/>:filtered.length===0?<EmptyState type={emptyType} language={language}/>:view==='calendar'?<Calendar year={selected.year} month={selected.month} books={filtered} onOpen={setModalBook} language={language}/>:<ReleaseList books={filtered} sort={sort} onSort={setSort} onOpen={setModalBook} favorites={favorites} onToggleFavorite={toggleFavorite} language={language}/>}</div></div></section></main><Footer language={language}/><BookModal book={modalBook} onClose={closeModal} isFavorite={!!modalBook&&favorites.includes(modalBook.id)} onToggleFavorite={toggleFavorite} language={language}/></>
}
export default App
