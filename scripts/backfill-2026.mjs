import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root=resolve(import.meta.dirname,'..')
const plCoverDir=resolve(root,'public/covers-2026-pl')
const usCoverDir=resolve(root,'public/covers-us')

const pl=[
 {id:'pl-2026-kazdy-twoj-ruch',title:'Każdy twój ruch',author:'C.L. Taylor',releaseDate:'2026-01-14',publisher:'Wydawnictwo Albatros',genre:'thriller',description:'Pięć osób prześladowanych przez stalkerów postanawia odwrócić role, zanim odliczanie wskaże kolejną ofiarę.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/kazdy-twoj-ruch/'},
 {id:'pl-2026-teoria-prawie-wszystkiego',title:'Teoria (prawie) wszystkiego',author:'Kara Gnodde',releaseDate:'2026-02-25',publisher:'Wydawnictwo Albatros',genre:'romans',description:'Ciepła opowieść o neuroróżnorodnym rodzeństwie, miłości i próbie ułożenia życia według algorytmu.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/teoria-prawie-wszystkiego/'},
 {id:'pl-2026-strategia-wyjscia',title:'Strategia wyjścia',author:'Lee Child',releaseDate:'2026-03-25',publisher:'Wydawnictwo Albatros',genre:'thriller',description:'Jack Reacher znajduje w kieszeni desperacką prośbę o pomoc i rusza tropem kolejnej niebezpiecznej sprawy.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/strategia-wyjscia/'},
 {id:'pl-2026-swiatlo-miedzy-oceanami',title:'Światło między oceanami',author:'M.L. Stedman',releaseDate:'2026-04-08',publisher:'Wydawnictwo Albatros',genre:'literatura piękna',description:'Opowieść o miłości, stracie i konsekwencjach decyzji podjętej na odległej wyspie z latarnią morską.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/swiatlo-miedzy-oceanami-4/'},
 {id:'pl-2026-sto-procent',title:'100 procent',author:'Anders Roslund',releaseDate:'2026-05-20',publisher:'Wydawnictwo Albatros',genre:'kryminał',description:'Ewert Grens i Piet Hoffmann mierzą się z wyjątkowo mroczną sprawą, która prowadzi do przestępczego półświatka Sztokholmu.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/100-procent/'},
 {id:'pl-2026-pocalunek-na-pozegnanie',title:'Pocałunek na pożegnanie',author:'Lisa Gardner',releaseDate:'2026-06-03',publisher:'Wydawnictwo Albatros',genre:'thriller',description:'Frankie Elkin szuka zaginionej kobiety, której najbliżsi przedstawiają zupełnie różne wersje wydarzeń.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/pocalunek-na-pozegnanie/'},
 {id:'pl-2026-zbrodnia-w-raju',title:'Zbrodnia w raju',author:'Guillaume Musso',releaseDate:'2026-07-29',publisher:'Wydawnictwo Albatros',genre:'kryminał',description:'Mroczna zagadka kryminalna w stylu retro, osadzona na francuskim Lazurowym Wybrzeżu lat dwudziestych.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/zbrodnia-w-raju/'},
 {id:'pl-2026-wdowa',title:'Wdowa',author:'John Grisham',releaseDate:'2026-08-12',publisher:'Wydawnictwo Albatros',genre:'thriller',description:'Prowincjonalny prawnik oskarżony o morderstwo musi odnaleźć prawdziwego zabójcę i oczyścić swoje nazwisko.',publisherUrl:'https://www.wydawnictwoalbatros.com/ksiazki/wdowa/'},
 {id:'pl-2026-dziewiecdziesiat-dni',title:'Dziewięćdziesiąt dni za żelazną kurtyną',author:'Gabriel García Márquez',releaseDate:'2026-12-02',publisher:'Czarne',genre:'literatura faktu',description:'Reporterski zapis podróży Gabriela Garcíi Márqueza po krajach Europy Środkowo-Wschodniej.',publisherUrl:'https://czarne.com.pl/katalog/ksiazki/dziewiecdziesiat-dni-za-zelazna-kurtyna',coverUrl:'https://czarne-uploads.b-cdn.net/czarne/uploads/catalog/product/cover/2103/marquez_.png'},
]

const us=[
 {id:'us-2026-good-guys',title:'Good Guys',author:'Sharon Bala',releaseDate:'2026-01-20',publisher:'Penguin Random House',genre:'literatura piękna',description:'A page-turning moral drama about money, philanthropy, and the cost of trying to change the world.',publisherUrl:'https://www.penguinrandomhouse.com/books/672845/good-guys-by-sharon-bala/',coverUrl:'https://images3.penguinrandomhouse.com/cover/9780771005237'},
 {id:'us-2026-astral-library',title:'The Astral Library',author:'Kate Quinn',releaseDate:'2026-02-17',publisher:'HarperCollins',genre:'fantasy',description:'A hidden door in the Boston Public Library opens into a magical refuge where books become worlds.',publisherUrl:'https://www.harpercollins.com/products/the-astral-library-kate-quinn',coverUrl:'https://is1-ssl.mzstatic.com/image/thumb/Publication221/v4/ab/c9/a9/abc9a927-9b9e-15bf-05ad-c1ef9d0977e2/9780063244801.jpg/1200x1800bb.jpg'},
 {id:'us-2026-forged-for-royalty',title:'Forged for Royalty',author:'Andrew Knighton',releaseDate:'2026-03-10',publisher:'Hachette Book Group',genre:'fantasy',description:'The final battle for Estia begins as Prince Raul struggles to keep a fragile rebellion from collapsing.',publisherUrl:'https://www.hachettebookgroup.com/titles/andrew-knighton/forged-for-royalty/9780316581776/'},
 {id:'us-2026-deathly-fates',title:'Deathly Fates',author:'Tesia Tsai',releaseDate:'2026-04-14',publisher:'Macmillan Publishers',genre:'young adult',description:'A Chinese-inspired fantasy about a priestess who guides the dead and a war that threatens everyone she loves.',publisherUrl:'https://us.macmillan.com/books/9781250378934/deathlyfates/',coverUrl:'https://mpd-biblio-covers.imgix.net/9781250378927.jpg?dpr=2&v=2&w=900'},
 {id:'us-2026-kiss-crimson-ash',title:'A Kiss of Crimson Ash',author:'Anuja Varghese',releaseDate:'2026-05-26',publisher:'Hachette Book Group',genre:'fantasy',description:'A lush romantasy inspired by medieval India, full of court intrigue, desire, and dangerous magic.',publisherUrl:'https://www.hachettebookgroup.com/titles/anuja-varghese/a-kiss-of-crimson-ash/9780316591843/'},
 {id:'us-2026-six-savage-thrones',title:'Six Savage Thrones',author:'Holly Race',releaseDate:'2026-06-16',publisher:'Hachette Book Group',genre:'fantasy',description:'A feminist epic of dragons, courtly intrigue, sapphic yearning, and six queens defying destiny.',publisherUrl:'https://www.hachettebookgroup.com/titles/holly-race/six-savage-thrones/9780316572897/'},
 {id:'us-2026-witch-dreaming-wood',title:'The Witch Below the Dreaming Wood',author:'H. G. Parry',releaseDate:'2026-07-21',publisher:'Hachette Book Group',genre:'fantasy',description:'A historical fantasy where wartime dreams come alive and Arthurian legends return.',publisherUrl:'https://www.hachettebookgroup.com/titles/h-g-parry/the-witch-below-the-dreaming-wood/9780316588249/'},
 {id:'us-2026-divine-gardener',title:"The Divine Gardener's Handbook",author:'Eli Snow',releaseDate:'2026-08-18',publisher:'Macmillan Publishers',genre:'fantasy',description:'A sapphic science-fantasy of botanical sabotage, divine gardens, rivalry, and rebellion.',publisherUrl:'https://us.macmillan.com/books/9781250395184/thedivinegardenershandbook/',coverUrl:'https://mpd-biblio-covers.imgix.net/9781250395184.jpg'},
 {id:'us-2026-dragons-heists',title:'Dragons, Heists, and Other Retirement Plans',author:'Meg Pennerson',releaseDate:'2026-09-01',publisher:'Hachette Book Group',genre:'fantasy',description:'Two retired criminals reunite for one last magical heist—with dragons, cats, and second chances.',publisherUrl:'https://www.hachettebookgroup.com/titles/meg-pennerson/dragons-heists-and-other-retirement-plans/9781538784464/'},
 {id:'us-2026-rising-thunder',title:'Rising Thunder',author:'Neal Shusterman',releaseDate:'2026-12-01',publisher:'Simon & Schuster',genre:'young adult',description:'A long-awaited Arc of a Scythe prequel about the fragile moment before humanity changes forever.',publisherUrl:'https://www.simonandschuster.com/books/Rising-Thunder/Neal-Shusterman/First-Blades/9781665972109',coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781665972109/rising-thunder-9781665972109_hr.jpg'},
]

function decode(value=''){return value.replace(/&amp;/g,'&').replace(/&#0?39;|&apos;/g,"'").replace(/&quot;/g,'"')}
async function pageCover(url){
 const response=await fetch(url,{headers:{'user-agent':'BookReleaseRadar/1.0'}})
 if(!response.ok)throw new Error(`${response.status} ${url}`)
 const html=await response.text()
 return decode(html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1]||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]||'')
}
async function save(records,dir,prefix){
 await mkdir(dir,{recursive:true})
 for(const book of records){
  const source=book.coverUrl||await pageCover(book.publisherUrl)
  if(!source)throw new Error(`No cover for ${book.title}`)
  const response=await fetch(source,{redirect:'follow',headers:{'user-agent':'BookReleaseRadar/1.0'}})
  if(!response.ok)throw new Error(`Cover ${response.status}: ${book.title}`)
  const type=response.headers.get('content-type')||''
  const extension=type.includes('png')?'png':'jpg'
  const file=`${book.id}.${extension}`
  const bytes=Buffer.from(await response.arrayBuffer())
  if(bytes.length<2500)throw new Error(`Cover too small: ${book.title}`)
  await writeFile(resolve(dir,file),bytes)
  book.cover=`/${prefix}/${file}`
  delete book.coverUrl
 }
}

await save(pl,plCoverDir,'covers-2026-pl')
await save(us,usCoverDir,'covers-us')
await writeFile(resolve(root,'public/data/pl-books-2026.json'),JSON.stringify(pl,null,2)+'\n')
const usPath=resolve(root,'public/data/us-books.json')
const existing=JSON.parse(await readFile(usPath,'utf8'))
const backfillIds=new Set(us.map(book=>book.id))
const combined=[...existing.filter(book=>!backfillIds.has(book.id)),...us].sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate)||a.title.localeCompare(b.title,'en'))
await writeFile(usPath,JSON.stringify(combined,null,2)+'\n')
console.log(`Saved ${pl.length} Polish and ${us.length} US verified 2026 releases.`)
