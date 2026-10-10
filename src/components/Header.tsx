import { Heart } from 'lucide-react'
import { appName, type Language } from '../i18n'

export function Header({favoritesCount,onFavorites,language,onLanguage}:{favoritesCount:number;onFavorites:()=>void;language:Language;onLanguage:(language:Language)=>void}) {
 const en=language==='en'
 return <header className="site-header"><a href="#top" className="brand"><strong>{appName(language)}</strong></a><nav aria-label={en?'Main navigation':'Nawigacja główna'}><a href="#premiery">{en?'Releases':'Premiery'}</a><a href="#kalendarz">{en?'Calendar':'Kalendarz'}</a><button className="nav-favorites" onClick={onFavorites}><Heart size={17} aria-hidden="true"/> {en?'Favorites':'Ulubione'} <span>{favoritesCount}</span></button><div className="language-switch" role="group" aria-label={en?'Language':'Język'}><button className={!en?'active':''} onClick={()=>onLanguage('pl')} aria-pressed={!en}>PL</button><button className={en?'active':''} onClick={()=>onLanguage('en')} aria-pressed={en}>EN</button></div></nav></header>
}
