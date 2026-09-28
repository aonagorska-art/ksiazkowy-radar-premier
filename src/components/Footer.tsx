import { Logo } from './Logo'
import { syncStatus } from '../data/syncStatus'
export function Footer() {const date=syncStatus.updatedAt.split('-').reverse().join('.');return <footer className="site-footer"><div className="footer-brand"><Logo small/><strong>KRP — Książkowy Radar Premier</strong></div><div className="footer-right"><span>Daty premier mogą ulec zmianie.</span><span>Dane z oficjalnych kart wydawców, automatycznie sprawdzone {date}.</span><span>© {new Date().getFullYear()} KRP</span></div></footer>}
