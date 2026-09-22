import { ArrowDownRight } from 'lucide-react'

export function Hero({ monthlyCount }: { monthlyCount: number }) {
 return (
  <section className="hero" id="top">
   <div className="hero-copy">
    <h1>Książkowy<br /><em>Radar Premier</em></h1>
    <a className="primary-button" href="#kalendarz">Przejdź do kalendarza <ArrowDownRight size={19} /></a>
    <div className="hero-note"><span>W wybranym miesiącu <strong>{monthlyCount} premier</strong></span></div>
   </div>
  </section>
 )
}
