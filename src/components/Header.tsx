import { Logo } from './Logo'
import { Heart } from 'lucide-react'
export function Header({favoritesCount,onFavorites}:{favoritesCount:number;onFavorites:()=>void}) { return <header className="site-header"><a href="#top" className="brand"><Logo/><span>Książkowy<br/><strong>Radar Premier</strong></span></a><nav aria-label="Nawigacja główna"><a href="#premiery">Premiery</a><a href="#kalendarz">Kalendarz</a><button className="nav-favorites" onClick={onFavorites}><Heart size={17} aria-hidden="true"/> Ulubione <span>{favoritesCount}</span></button></nav></header> }
