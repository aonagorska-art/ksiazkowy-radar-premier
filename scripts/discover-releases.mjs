import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const booksSource = await readFile(resolve(root, 'src/data/books.ts'), 'utf8')
const outputPath = resolve(root, 'public/data/auto-books.json')
const candidateLimit = Number(process.env.DISCOVERY_LIMIT || 90)

const sources = [
 { publisher: 'Wydawnictwo Poznańskie', origin: 'https://wydawnictwopoznanskie.pl', include: /\/produkt\//i },
 { publisher: 'Wydawnictwo Albatros', origin: 'https://www.wydawnictwoalbatros.com', include: /\/ksiazki\//i },
 { publisher: 'Wydawnictwo Jaguar', origin: 'https://wydawnictwo-jaguar.pl', include: /\/sklep\/produkt\//i },
 { publisher: 'Wydawnictwo NieZwykłe', origin: 'https://wydawnictwoniezwykle.pl', include: /\/(romans-i-erotyka|fantasy|new-adult-2|young-adult)\//i },
 { publisher: 'Czwarta Strona', origin: 'https://czwartastrona.pl', include: /\/produkt\//i },
 { publisher: 'Znak Literanova', origin: 'https://www.znak.com.pl', include: /\/p\//i },
 { publisher: 'Uroboros', origin: 'https://www.gwfoksal.pl', include: /\.html(?:$|\?)/i },
 { publisher: 'Hype', origin: 'https://www.wydawnictwofilia.pl', include: /\/Ksiazka\//i },
]

const sitemapNames = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml']
const monthNames = { stycznia:'01',lutego:'02',marca:'03',kwietnia:'04',maja:'05',czerwca:'06',lipca:'07',sierpnia:'08',września:'09',pazdziernika:'10',października:'10',listopada:'11',grudnia:'12' }
const genreRules = [
 ['dark romans', /dark\s*romance|dark\s*romans/i],
 ['fantasy', /fantasy|fantastyka|smok|magia/i],
 ['horror', /horror|groza/i],
 ['kryminał', /kryminał|detective|śledztw/i],
 ['literatura faktu', /literatura faktu|reportaż|biografi|non.?fiction/i],
 ['literatura piękna', /literatura piękna|powieść obyczajowa/i],
 ['romans', /romans|romance|erotyk/i],
 ['science fiction', /science fiction|sci-fi/i],
 ['thriller', /thriller|sensacj/i],
 ['young adult', /young adult|new adult|młodzież/i],
]

function decode(value = '') {
 return value.replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;|&#34;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/\s+/g,' ').trim()
}

function plainText(html) {
 return decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' '))
}

function normalizeDate(raw) {
 const value=decode(raw).toLocaleLowerCase('pl-PL')
 if(/^20\d{2}-\d{2}-\d{2}$/.test(value))return value
 const numeric=value.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](20\d{2})$/)
 if(numeric)return `${numeric[3]}-${numeric[2].padStart(2,'0')}-${numeric[1].padStart(2,'0')}`
 const words=value.normalize('NFC').match(/^(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(20\d{2})$/i)
 if(words&&monthNames[words[2]])return `${words[3]}-${monthNames[words[2]]}-${words[1].padStart(2,'0')}`
 return null
}

function releaseDate(html) {
 const text=plainText(html)
 const patterns=[
  /(?:data\s+(?:premiery|wydania)|premiera|premierę)\s*(?::|-)?\s*(20\d{2}-\d{1,2}-\d{1,2}|\d{1,2}[.\/-]\d{1,2}[.\/-]20\d{2}|\d{1,2}\s+[a-ząćęłńóśźż]+\s+20\d{2})/iu,
  /"(?:releaseDate|datePublished|availabilityStarts)"\s*:\s*"(20\d{2}-\d{2}-\d{2})"/i,
 ]
 for(const pattern of patterns){const match=(pattern===patterns[0]?text:html).match(pattern);const date=match?normalizeDate(match[1]):null;if(date)return date}
 return null
}

function meta(html, key) {
 const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
 const patterns=[
  new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,'i'),
  new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,'i'),
 ]
 for(const pattern of patterns){const match=html.match(pattern);if(match)return decode(match[1])}
 return ''
}

function jsonLd(html) {
 for(const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const parsed=JSON.parse(match[1].trim())
   const nodes=Array.isArray(parsed)?parsed:parsed['@graph']??[parsed]
   for(const node of nodes){const type=String(node?.['@type']??'');if(/Product|Book/i.test(type))return node}
  }catch{/* malformed metadata from a publisher page */}
 }
 return {}
}

function authorFrom(html, schema) {
 const author=schema.author
 if(typeof author==='string')return decode(author)
 if(author?.name)return decode(author.name)
 if(Array.isArray(author))return author.map(item=>decode(item?.name??item)).filter(Boolean).join(', ')
 const patterns=[
  /\/autor(?:zy)?\/[^"']+["'][^>]*>([^<]{2,120})<\/a>/i,
  /(?:Autor|Autorka|Autorzy)\s*<\/[^>]+>\s*<[^>]+>\s*([^<]{3,120})</i,
  /(?:Autor|Autorka|Autorzy)\s*:?\s*<a[^>]*>([^<]{3,120})<\/a>/i,
  /"author"\s*:\s*"([^"]{3,120})"/i,
 ]
 for(const pattern of patterns){const match=html.match(pattern);if(match)return decode(match[1])}
 return ''
}

function imageFrom(schema, html) {
 const image=Array.isArray(schema.image)?schema.image[0]:schema.image
 return typeof image==='string'?image:image?.url??meta(html,'og:image')
}

function slug(value) {
 return value.toLocaleLowerCase('pl-PL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)
}

function inferGenre(url, title, description) {
 if(/\/fantasy\//i.test(url))return 'fantasy'
 if(/\/young-adult\//i.test(url))return 'young adult'
 if(/\/new-adult-2\//i.test(url))return 'romans'
 const haystack=`${url} ${title} ${description}`
 return genreRules.find(([,pattern])=>pattern.test(haystack))?.[0]??'inne'
}

function withinCatalogWindow(date) {
 const value=new Date(`${date}T12:00:00Z`).getTime()
 const now=Date.now()
 const currentYear=new Date(now).getUTCFullYear()
 const startOfCurrentYear=Date.UTC(currentYear,0,1)
 return value>=startOfCurrentYear&&value<=now+1000*60*60*24*550
}

async function fetchText(url, timeoutMs=12_000) {
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs)
 try{
  const response=await fetch(url,{headers:{'user-agent':'KsiazkowyRadarPremier/2.0 (+https://ksiazkowy-radar-premier.netlify.app)'},redirect:'follow',signal:controller.signal})
  if(!response.ok)throw new Error(`HTTP ${response.status}`)
  return await response.text()
 }finally{clearTimeout(timer)}
}

function sitemapEntries(xml) {
 return [...xml.matchAll(/<url>[^]*?<loc>([^<]+)<\/loc>[^]*?(?:<lastmod>([^<]+)<\/lastmod>)?[^]*?<\/url>/gi)].map(match=>({url:decode(match[1]),lastmod:match[2]??''}))
}

function sitemapLinks(xml) {
 return [...xml.matchAll(/<sitemap>[^]*?<loc>([^<]+)<\/loc>[^]*?<\/sitemap>/gi)].map(match=>decode(match[1]))
}

async function candidateUrls(source) {
 const queue=sitemapNames.map(name=>`${source.origin}${name}`)
 const visited=new Set();const entries=[]
 while(queue.length&&visited.size<12){
  const url=queue.shift();if(visited.has(url))continue;visited.add(url)
  try{
   const xml=await fetchText(url)
   queue.push(...sitemapLinks(xml).filter(item=>!visited.has(item)).slice(0,8))
   entries.push(...sitemapEntries(xml).filter(item=>source.include.test(item.url)))
  }catch{/* try the next conventional sitemap */}
 }
 const unique=entries.map(item=>item.url).filter((url,index,array)=>array.indexOf(url)===index)
 const dated=entries.some(item=>item.lastmod)
 if(dated)return entries.sort((a,b)=>String(b.lastmod).localeCompare(String(a.lastmod))).map(item=>item.url).filter((url,index,array)=>array.indexOf(url)===index).slice(0,candidateLimit)
 return unique.slice(-candidateLimit).reverse()
}

function knownUrls() {
 const urls=new Set([...booksSource.matchAll(/https?:\/\/[^']+/g)].map(match=>match[0].replace(/\/$/,'')))
 for(const line of booksSource.split('\n')){
  const match=line.match(/entry\('(p|a)','([^']+)'/)
  if(!match)continue
  const base=match[1]==='p'?'https://wydawnictwopoznanskie.pl/produkt/':'https://www.wydawnictwoalbatros.com/ksiazki/'
  urls.add(`${base}${match[2]}`)
 }
 return urls
}

async function inspect(url, source) {
 try{
  const html=await fetchText(url)
  const date=releaseDate(html)
  if(!date||!withinCatalogWindow(date))return null
  const schema=jsonLd(html)
  const title=decode(schema.name??meta(html,'og:title')).replace(/^Książka\s+/i,'').replace(/\s*[|–]\s*[^|–]{2,40}$/,'').trim()
  const author=authorFrom(html,schema)
  const cover=imageFrom(schema,html)
  if(title.length<2||author.length<2||!cover)return null
  const rawDescription=decode(schema.description??meta(html,'description')??meta(html,'og:description'))
  return {
   id:`auto-${slug(source.publisher)}-${slug(title)}`,
   title,author,releaseDate:date,publisher:source.publisher,
   genre:inferGenre(url,title,rawDescription),
   description:`Premiera książki „${title}” autorstwa ${author}. Sprawdź oficjalną kartę wydawcy, aby przeczytać pełny opis.`,
   cover,publisherUrl:url,
  }
 }catch{return null}
}

async function mapLimit(items,limit,task) {
 const results=new Array(items.length);let cursor=0
 async function worker(){while(cursor<items.length){const index=cursor++;results[index]=await task(items[index])}}
 await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return results
}

let previous=[]
try{previous=JSON.parse(await readFile(outputPath,'utf8'))}catch{/* first run */}
const byUrl=new Map(previous.map(book=>[book.publisherUrl.replace(/\/$/,''),book]))
const known=knownUrls()
const sourceReport=[]

for(const source of sources){
 const urls=await candidateUrls(source)
 const fresh=urls.filter(url=>!known.has(url.replace(/\/$/,'')))
 const found=(await mapLimit(fresh,5,url=>inspect(url,source))).filter(Boolean)
 for(const book of found)byUrl.set(book.publisherUrl.replace(/\/$/,''),book)
 sourceReport.push({publisher:source.publisher,candidates:urls.length,checked:fresh.length,found:found.length})
}

const autoBooks=[...byUrl.values()].filter(book=>withinCatalogWindow(book.releaseDate)&&!/\+|pakiet|zestaw\s+\d+\s+książek/i.test(book.title)).sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate)||a.title.localeCompare(b.title,'pl'))
await mkdir(dirname(outputPath),{recursive:true})
await writeFile(outputPath,`${JSON.stringify(autoBooks,null,2)}\n`)
console.log(`Automatyczny katalog: ${autoBooks.length} tytułów (${autoBooks.length-previous.length>=0?'+':''}${autoBooks.length-previous.length}).`)
for(const item of sourceReport)console.log(`- ${item.publisher}: ${item.candidates} adresów, ${item.checked} sprawdzonych, ${item.found} nowych`)
