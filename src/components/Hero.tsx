import { ArrowDownRight } from 'lucide-react'
import { pluralizePl } from '../lib/plural'
import { type Language } from '../i18n'

export function Hero({monthlyCount,language}:{monthlyCount:number;language:Language}) {
 const en=language==='en'
 return <section className="hero" id="top"><div className="hero-copy"><h1>{en?<><span>Book Release</span><br/><em>Radar</em></>:<>Książkowy<br/><em>Radar Premier</em></>}</h1><a className="primary-button" href="#kalendarz">{en?'View calendar':'Przejdź do kalendarza'} <ArrowDownRight size={19}/></a><div className="hero-note"><span>{en?'In the selected month: ':'W wybranym miesiącu '}<strong>{monthlyCount} {en?(monthlyCount===1?'release':'releases'):pluralizePl(monthlyCount,'premiera','premiery','premier')}</strong></span></div></div></section>
}
