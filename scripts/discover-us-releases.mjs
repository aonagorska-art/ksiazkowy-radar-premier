import { readFile, writeFile } from 'node:fs/promises'

const OUTPUT = new URL('../public/data/us-books.json', import.meta.url)
const publishers = [
 'Penguin Random House','HarperCollins','Simon & Schuster',
 'Hachette Book Group','Macmillan Publishers',
 'Feiwel & Friends','First Second','Flatiron Books','Henry Holt and Co.',
 'Roaring Brook Press','St. Martin’s Press','Wednesday Books',
 'Farrar, Straus and Giroux','Tor Books','Ace','Ballantine Books','Del Rey',
 'Delacorte Press','Dutton Books for Young Readers','Inklore','The Dial Press',
 'Ten Speed Graphic','Poisoned Pen Press','Sourcebooks'
]
const limit = Number(process.env.US_DISCOVERY_LIMIT || 32)
const now = new Date()
const minDate = new Date(Date.UTC(now.getUTCFullYear(),0,1))
const maxDate = new Date(now); maxDate.setFullYear(maxDate.getFullYear() + 1)

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const slugify = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const normalizePublisher = value => String(value || '').replace(/’/g,"'").toLowerCase()
function parseDate(value) {
 if (!value) return null
 const parsed = new Date(value)
 if (Number.isNaN(parsed.getTime()) || !/[0-9]{4}/.test(value) || !(/[A-Za-z]+\s+\d{1,2}/.test(value) || /\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(value))) return null
 return parsed
}
function iso(date){return date.toISOString().slice(0,10)}
function inferGenre(subjects=[]){
 const text=subjects.join(' ').toLowerCase()
 if(/horror|gothic/.test(text))return 'horror'
 if(/fantasy|magic/.test(text))return 'fantasy'
 if(/science fiction|dystop/.test(text))return 'science fiction'
 if(/thriller|suspense/.test(text))return 'thriller'
 if(/mystery|crime|detective/.test(text))return 'kryminał'
 if(/romance|love stories/.test(text))return 'romans'
 if(/young adult|juvenile/.test(text))return 'young adult'
 if(/biograph|memoir|history|politic|social science/.test(text))return 'literatura faktu'
 return 'literatura piękna'
}
async function getJson(url){
 const response=await fetch(url,{headers:{'user-agent':'BookReleaseRadar/1.0 (release calendar)'}})
 if(!response.ok)throw new Error(String(response.status))
 return response.json()
}
const prhPublishers=['Penguin Random House','Ace','Ballantine Books','Del Rey','Delacorte Press','Dutton Books for Young Readers','Inklore','The Dial Press','Ten Speed Graphic','Random House']
function officialUrl(isbn,title,publisher){
 if(prhPublishers.some(name=>normalizePublisher(publisher).includes(normalizePublisher(name))))return `https://www.penguinrandomhouse.com/search/?q=${isbn}`
 if(/harpercollins/i.test(publisher))return `https://www.harpercollins.com/search?q=${isbn}`
 if(/simon\s*&\s*schuster/i.test(publisher))return `https://www.simonandschuster.com/search/books/_/N-/Ntt-${isbn}`
 if(/hachette/i.test(publisher))return `https://www.hachettebookgroup.com/?s=${isbn}`
 if(/sourcebooks|poisoned pen/i.test(publisher))return `https://www.sourcebooks.com/catalogsearch/result/?q=${isbn}`
 return `https://us.macmillan.com/books/${isbn}/${slugify(title)}/`
}
async function findCoverUrl(isbn,publisher){
 const candidates=[]
 if(prhPublishers.some(name=>normalizePublisher(publisher).includes(normalizePublisher(name)))){
  for(let host=1;host<=4;host++)candidates.push(`https://images${host}.penguinrandomhouse.com/cover/${isbn}`)
 }
 if(/sourcebooks|poisoned pen/i.test(publisher))candidates.push(`https://www.sourcebooks.com/media/catalog/product/${isbn.slice(0,2).split('').join('/')}/${isbn}.jpg?auto=webp&format=pjpg&width=900&height=1350&fit=cover`)
 candidates.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`)
 for(const url of candidates){
  try{
   const response=await fetch(url,{redirect:'follow',headers:{'user-agent':'BookReleaseRadar/1.0'}})
   if(!response.ok)continue
   const bytes=Buffer.from(await response.arrayBuffer())
   if(bytes.length<2500)continue
   return url
  }catch{}
 }
 return null
}

const existing=JSON.parse(await readFile(OUTPUT,'utf8'))
const known=new Set(existing.map(book=>`${book.title}|${book.author}`.toLowerCase()))
const discovered=[]
for(const publisher of publishers){
 if(discovered.length>=limit)break
 const query=new URL('https://openlibrary.org/search.json')
 query.searchParams.set('publisher',publisher)
 query.searchParams.set('language','eng')
 query.searchParams.set('sort','new')
 query.searchParams.set('limit','18')
 query.searchParams.set('fields','title,author_name,edition_key,isbn,subject,publisher')
 let docs=[]
 try{docs=(await getJson(query)).docs || []}catch(error){console.warn(`Search failed for ${publisher}: ${error.message}`);continue}
 for(const doc of docs){
  if(discovered.length>=limit)break
  const author=doc.author_name?.[0]
  if(!doc.title || !author || known.has(`${doc.title}|${author}`.toLowerCase()))continue
  const editionKeys=(doc.edition_key || []).slice(0,8)
  let match=null
  for(const key of editionKeys){
   try{
    const edition=await getJson(`https://openlibrary.org/books/${key}.json`)
    const date=parseDate(edition.publish_date)
    const imprint=(edition.publishers || []).find(value=>normalizePublisher(value).includes(normalizePublisher(publisher)) || normalizePublisher(publisher).includes(normalizePublisher(value)))
    const isbn=(edition.isbn_13 || []).find(value=>/^97[89]\d{10}$/.test(value))
    if(date && date>=minDate && date<=maxDate && imprint && isbn){match={date,isbn,publisher:imprint};break}
   }catch{}
   await delay(80)
  }
  if(!match)continue
  const slug=`${slugify(doc.title)}-${match.isbn.slice(-5)}`
  const cover=await findCoverUrl(match.isbn,match.publisher)
  if(!cover)continue
  const item={
   id:`us-auto-${slug}`,
   title:doc.title,
   author,
   releaseDate:iso(match.date),
   publisher:match.publisher,
   genre:inferGenre(doc.subject || []),
   description:`A forthcoming US release from ${match.publisher}. Open the publisher page for the official description and current publication details.`,
   cover,
   publisherUrl:officialUrl(match.isbn,doc.title,match.publisher),
   market:'US'
  }
  discovered.push(item);known.add(`${doc.title}|${author}`.toLowerCase())
  console.log(`Found: ${item.releaseDate} — ${item.title}`)
 }
}
const combined=[...existing,...discovered].sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate)||a.title.localeCompare(b.title,'en'))
await writeFile(OUTPUT,JSON.stringify(combined,null,2)+'\n')
console.log(`US catalog: ${combined.length} titles (${discovered.length} new).`)
