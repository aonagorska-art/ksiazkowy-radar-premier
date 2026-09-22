import { Logo } from './Logo'
export function Footer() {return <footer className="site-footer"><div className="footer-brand"><Logo small/><strong>KRP — Książkowy Radar Premier</strong></div><div className="footer-right"><span>Daty premier mogą ulec zmianie.</span><span>Dane z oficjalnych kart wydawców, sprawdzone 22.09.2026.</span><span>© {new Date().getFullYear()} KRP</span></div></footer>}
