import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const booksPath = resolve(root, 'src/data/books.ts')
const statusPath = resolve(root, 'src/data/syncStatus.ts')
const reportPath = resolve(root, 'public/data/sync-report.json')
const source = await readFile(booksPath, 'utf8')

const polishMonths = {
 stycznia:'01',lutego:'02',marca:'03',kwietnia:'04',maja:'05',czerwca:'06',lipca:'07',sierpnia:'08',września:'09',pazdziernika:'10',października:'10',listopada:'11',grudnia:'12',
}

function quotedStrings(line) {
 return [...line.matchAll(/'((?:\\.|[^'])*)'/g)].map(match=>match[1].replaceAll("\\'", "'"))
}

function catalogEntries(text) {
 return text.split('\n').flatMap(line=>{
  const trimmed=line.trim()
  if(!trimmed.startsWith('entry(')&&!trimmed.startsWith('verified('))return []
  const values=quotedStrings(line)
  if(trimmed.startsWith('entry(')){
   const [sourceKey,id,,,releaseDate]=values
   const base=sourceKey==='p'?'https://wydawnictwopoznanskie.pl/produkt/':'https://www.wydawnictwoalbatros.com/ksiazki/'
   return [{id,releaseDate,publisherUrl:`${base}${id}/`}]
  }
  const [id,,,releaseDate,,,,publisherUrl]=values
  return [{id,releaseDate,publisherUrl}]
 }).filter(item=>item.id&&item.releaseDate&&item.publisherUrl)
}

function plainText(html) {
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;|&#34;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ')
}

function normalizeDate(raw) {
 const value=raw.trim().toLocaleLowerCase('pl-PL')
 if(/^20\d{2}-\d{2}-\d{2}$/.test(value))return value
 const numeric=value.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](20\d{2})$/)
 if(numeric)return `${numeric[3]}-${numeric[2].padStart(2,'0')}-${numeric[1].padStart(2,'0')}`
 const words=value.normalize('NFC').match(/^(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(20\d{2})$/i)
 if(words&&polishMonths[words[2]])return `${words[3]}-${polishMonths[words[2]]}-${words[1].padStart(2,'0')}`
 return null
}

function extractReleaseDate(html) {
 const candidates=[plainText(html),html.replace(/\\u00a0|&nbsp;/g,' ').replace(/\\/g,'')]
 const pattern=/(?:data\s+(?:premiery|wydania)|premiera)\s*(?::|<!--.*?-->)?\s*(20\d{2}-\d{1,2}-\d{1,2}|\d{1,2}[.\/-]\d{1,2}[.\/-]20\d{2}|\d{1,2}\s+[a-ząćęłńóśźż]+\s+20\d{2})/iu
 for(const candidate of candidates){const match=candidate.match(pattern);const date=match?normalizeDate(match[1]):null;if(date)return date}
 return null
}

async function inspect(entry) {
 const controller=new AbortController()
 const timeout=setTimeout(()=>controller.abort(),15_000)
 try{
  const response=await fetch(entry.publisherUrl,{headers:{'user-agent':'KsiazkowyRadarPremier/1.0 (+https://ksiazkowy-radar-premier.netlify.app)'},redirect:'follow',signal:controller.signal})
  if(!response.ok)throw new Error(`HTTP ${response.status}`)
  const detectedDate=extractReleaseDate(await response.text())
  if(!detectedDate)throw new Error('nie znaleziono daty premiery')
  return {...entry,detectedDate,status:'ok'}
 }catch(error){return {...entry,status:'warning',message:error instanceof Error?error.message:String(error)}}finally{clearTimeout(timeout)}
}

async function mapWithConcurrency(items,limit,task) {
 const results=new Array(items.length);let cursor=0
 async function worker(){while(cursor<items.length){const index=cursor++;results[index]=await task(items[index])}}
 await Promise.all(Array.from({length:Math.min(limit,items.length)},worker))
 return results
}

const entries=catalogEntries(source)
const results=await mapWithConcurrency(entries,6,inspect)
const successful=results.filter(result=>result.status==='ok')
if(successful.length===0)throw new Error('Nie udało się sprawdzić żadnej oficjalnej karty wydawcy.')

let updatedSource=source
const changes=[]
for(const result of successful){
 if(result.detectedDate===result.releaseDate)continue
 const lines=updatedSource.split('\n')
 const index=lines.findIndex(line=>line.includes(`'${result.id}'`))
 if(index<0||!lines[index].includes(`'${result.releaseDate}'`))continue
 lines[index]=lines[index].replace(`'${result.releaseDate}'`,`'${result.detectedDate}'`)
 updatedSource=lines.join('\n')
 changes.push({id:result.id,from:result.releaseDate,to:result.detectedDate})
}

const updatedAt=new Date().toISOString().slice(0,10)
const warnings=results.filter(result=>result.status==='warning')
const status=`export const syncStatus = {\n  updatedAt: '${updatedAt}',\n  checked: ${successful.length},\n  warnings: ${warnings.length},\n} as const\n`
const report={updatedAt,checked:successful.length,warnings:warnings.map(({id,publisherUrl,message})=>({id,publisherUrl,message})),changes}
await mkdir(dirname(reportPath),{recursive:true})
await Promise.all([writeFile(booksPath,updatedSource),writeFile(statusPath,status),writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`)])
console.log(`Sprawdzono ${successful.length}/${entries.length} kart. Zmieniono ${changes.length} dat. Ostrzeżenia: ${warnings.length}.`)
for(const change of changes)console.log(`- ${change.id}: ${change.from} -> ${change.to}`)
for(const warning of warnings)console.warn(`- ${warning.id}: ${warning.message}`)
