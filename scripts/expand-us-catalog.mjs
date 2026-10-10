import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dataPath = resolve(root, 'public/data/us-books.json')
const coverDir = resolve(root, 'public/covers-us')

const books = [
  { id: 'us-2026-the-list', title: 'The List', author: 'Steve Berry', releaseDate: '2026-01-06', publisher: 'Grand Central Publishing', genre: 'thriller', description: 'A former lawyer returns home and becomes entangled in a murder case with dangerous local secrets.', publisherUrl: 'https://www.hachettebookgroup.com/titles/steve-berry/the-list/9781538770887/' },
  { id: 'us-2026-godfall', title: 'Godfall', author: 'Van Jensen', releaseDate: '2026-01-20', publisher: 'Grand Central Publishing', genre: 'science fiction', description: 'A small-town sheriff investigates brutal murders in the shadow of a colossal alien body.', publisherUrl: 'https://www.hachettebookgroup.com/titles/van-jensen/godfall/9781538783412/' },
  { id: 'us-2026-halcyon-years', title: 'Halcyon Years', author: 'Alastair Reynolds', releaseDate: '2026-01-27', publisher: 'Orbit', genre: 'science fiction', description: 'A private investigator examines a suspicious death aboard a starship in this space-opera mystery.', publisherUrl: 'https://www.hachettebookgroup.com/titles/alastair-reynolds/halcyon-years/9780316607087/' },
  { id: 'us-2026-game-set-match', title: 'Game, Set, Match', author: 'Jennifer Iacopelli', releaseDate: '2026-02-03', publisher: 'Requited', genre: 'romans', description: 'A rising tennis star meets the champion who broke her heart, and competition turns into chemistry.', publisherUrl: 'https://www.hachettebookgroup.com/titles/jennifer-iacopelli/game-set-match/9780316610568/' },
  { id: 'us-2026-fenway-punk', title: 'Fenway Punk', author: 'Chris Wrenn', releaseDate: '2026-02-10', publisher: 'Running Press', genre: 'literatura faktu', description: 'A social history of Boston punk, an independent label, and baseball’s greatest rivalry.', publisherUrl: 'https://www.hachettebookgroup.com/titles/chris-wrenn/fenway-punk/9798894140872/' },
  { id: 'us-2026-picking-daisies', title: 'Picking Daisies on Sundays', author: 'Liana Cincotti', releaseDate: '2026-02-17', publisher: 'Forever', genre: 'romans', description: 'Childhood best friends reunite for a fake relationship that revives very real feelings.', publisherUrl: 'https://www.hachettebookgroup.com/titles/liana-cincotti/picking-daisies-on-sundays/9781538782958/' },
  { id: 'us-2026-dire-bound', title: 'Dire Bound', author: 'Sable Sorensen', releaseDate: '2026-03-03', publisher: 'Requited', genre: 'dark romans', description: 'A dangerous romantasy of bonded direwolves, deadly trials, and a heroine fighting for her sister.', publisherUrl: 'https://www.hachettebookgroup.com/titles/sable-sorensen/dire-bound-standard-edition/9780316601481/' },
  { id: 'us-2026-nesting', title: 'Nesting', author: "Roisín O'Donnell", releaseDate: '2026-03-03', publisher: 'Algonquin Books', genre: 'literatura piękna', description: 'A woman leaves an unsafe marriage and builds a new life for herself and her daughters.', publisherUrl: 'https://www.hachettebookgroup.com/titles/roisin-odonnell/nesting/9781643755717/' },
  { id: 'us-2026-king-of-nothing', title: 'King of Nothing', author: 'Nathanael Lessore', releaseDate: '2026-03-10', publisher: 'Little, Brown Books for Young Readers', genre: 'young adult', description: 'A funny, warm YA story about friendship, masculinity, and an unexpected connection.', publisherUrl: 'https://www.hachettebookgroup.com/titles/nathanael-lessore/king-of-nothing/9780316588560/' },
  { id: 'us-2026-lincoln-lawyer', title: 'The Lincoln Lawyer', author: 'Michael Connelly', releaseDate: '2026-03-17', publisher: 'Little, Brown and Company', genre: 'thriller', description: 'Defense attorney Mickey Haller takes a seemingly easy case that becomes a fight for survival.', publisherUrl: 'https://www.hachettebookgroup.com/titles/michael-connelly/the-lincoln-lawyer/9780316608220/' },
  { id: 'us-2026-seyoon-dean', title: 'Seyoon and Dean, Unscripted', author: 'Sujin Witherspoon', releaseDate: '2026-04-07', publisher: 'Union Square & Co.', genre: 'young adult', description: 'Two teens compete on a reality show and get framed as rivals-to-lovers by the producers.', publisherUrl: 'https://www.hachettebookgroup.com/titles/sujin-witherspoon/seyoon-and-dean-unscripted/9781454954057/' },
  { id: 'us-2026-wifehouse', title: 'Wifehouse', author: 'Sonya Walger', releaseDate: '2026-04-07', publisher: 'Union Square & Co.', genre: 'literatura piękna', description: 'A wife and mother makes the complicated decision to put her own happiness first.', publisherUrl: 'https://www.hachettebookgroup.com/titles/sonya-walger/wifehouse/9781454963301/' },
  { id: 'us-2026-nightshade', title: 'Nightshade', author: 'Michael Connelly', releaseDate: '2026-04-07', publisher: 'Little, Brown and Company', genre: 'kryminał', description: 'Detective Stilwell investigates a case beneath the idyllic surface of Catalina Island.', publisherUrl: 'https://www.hachettebookgroup.com/titles/michael-connelly/nightshade/9780316588508/' },
  { id: 'us-2026-odessa', title: 'Odessa', author: 'Gabrielle Sher', releaseDate: '2026-04-21', publisher: 'Little, Brown and Company', genre: 'fantasy', description: 'A grieving family turns to ancient magic in a historical novel set during the Russian pogroms.', publisherUrl: 'https://www.hachettebookgroup.com/titles/gabrielle-sher/odessa/9780316595858/' },
  { id: 'us-2026-moon-galapagos', title: 'Moon Galápagos Islands', author: 'Lisa Cho Burns', releaseDate: '2026-05-05', publisher: 'Moon Travel', genre: 'literatura faktu', description: 'A practical guide to wildlife, diving, cruises, and responsible travel in the Galápagos.', publisherUrl: 'https://www.hachettebookgroup.com/titles/lisa-cho-burns-2/moon-gal%C3%A1pagos-islands/9798886471601/' },
  { id: 'us-2026-radiant-star', title: 'Radiant Star', author: 'Ann Leckie', releaseDate: '2026-05-12', publisher: 'Orbit', genre: 'science fiction', description: 'A standalone Imperial Radch novel about power, identity, faith, and belonging.', publisherUrl: 'https://www.hachettebookgroup.com/titles/ann-leckie/radiant-star/9780316290357/' },
  { id: 'us-2026-ancient-myths', title: 'Ancient Myths and Legends Without Men', author: 'Mara Gold', releaseDate: '2026-05-26', publisher: 'Running Press', genre: 'literatura faktu', description: 'A feminist reexamination of mythology’s goddesses, warriors, witches, and monsters.', publisherUrl: 'https://www.hachettebookgroup.com/titles/mara-gold/ancient-myths-and-legends-without-men/9798894142739/' },
  { id: 'us-2026-some-sort-justice', title: 'Some Sort of Justice', author: 'Peter Grainger', releaseDate: '2026-06-02', publisher: 'Union Square & Co.', genre: 'kryminał', description: 'Detectives uncover a cover-up surrounding the suspicious death of a young earl.', publisherUrl: 'https://www.hachettebookgroup.com/titles/peter-grainger/some-sort-of-justice/9781454968863/' },
  { id: 'us-2026-broken-hearts-agency', title: 'The Broken Hearts Agency', author: 'Clarence A. Haynes', releaseDate: '2026-06-23', publisher: 'Legacy Lit', genre: 'horror', description: 'A mystical detective investigates an evil force feeding on desire and stealing memories.', publisherUrl: 'https://www.hachettebookgroup.com/titles/clarence-a-haynes/the-broken-hearts-agency/9781538780459/' },
  { id: 'us-2026-summer-affair', title: 'A Summer Affair', author: 'Elin Hilderbrand', releaseDate: '2026-06-30', publisher: 'Little, Brown Paperbacks', genre: 'romans', description: 'A summer story of temptation, secrets, family, and the cost of an affair.', publisherUrl: 'https://www.hachettebookgroup.com/titles/elin-hilderbrand/a-summer-affair/9780316607384/' },
  { id: 'us-2026-white-lights', title: 'White Lights', author: 'Lauren Kate', releaseDate: '2026-07-07', publisher: 'Grand Central Publishing', genre: 'romans', description: 'A sweeping supernatural romance from the author of the Fallen series.', publisherUrl: 'https://www.hachettebookgroup.com/titles/lauren-kate/white-lights/9781538783498/' },
  { id: 'us-2026-house-guest', title: 'The House Guest', author: 'Jennifer Pashley', releaseDate: '2026-07-07', publisher: 'Little, Brown and Company', genre: 'thriller', description: 'A private chef’s new job for a bestselling author turns into deadly suspense.', publisherUrl: 'https://www.hachettebookgroup.com/titles/jennifer-pashley/the-house-guest/9780316600798/' },
  { id: 'us-2026-white-rabbit', title: 'White Rabbit', author: 'Abigail Rose-Marie', releaseDate: '2026-07-14', publisher: 'Union Square & Co.', genre: 'horror', description: 'A grieving girl befriends the ghost of Sylvia Plath in a crumbling seaside house.', publisherUrl: 'https://www.hachettebookgroup.com/titles/abigail-rose-marie/white-rabbit/9781454966258/' },
  { id: 'us-2026-new-people', title: 'The New People', author: 'Andrea Uptmor', releaseDate: '2026-07-21', publisher: 'Little, Brown and Company', genre: 'literatura piękna', description: 'A newly married couple buys a foreclosure without knowing its former owners still live inside.', publisherUrl: 'https://www.hachettebookgroup.com/titles/andrea-uptmor/the-new-people/9780316602211/' },
  { id: 'us-2026-exhumed', title: 'Exhumed', author: 'Aaron Mahnke', releaseDate: '2026-08-04', publisher: 'Running Press', genre: 'literatura faktu', description: 'A cultural history that unearths the roots of the American vampire.', publisherUrl: 'https://www.hachettebookgroup.com/titles/aaron-mahnke/exhumed/9798894141817/' },
  { id: 'us-2026-metamorphosis', title: 'The Metamorphosis & Other Stories', author: 'Franz Kafka', releaseDate: '2026-08-04', publisher: 'Union Square & Co.', genre: 'horror', description: 'A new gift edition collecting Kafka’s unsettling and darkly comic short fiction.', publisherUrl: 'https://www.hachettebookgroup.com/titles/franz-kafka-2/the-metamorphosis-other-stories/9781454966005/' },
  { id: 'us-2026-summer-stars', title: 'A Summer of Stars', author: 'Liana Cincotti', releaseDate: '2026-08-11', publisher: 'Forever', genre: 'romans', description: 'A tennis pro and a Hollywood star fake-date their way from rivalry to romance.', publisherUrl: 'https://www.hachettebookgroup.com/titles/liana-cincotti/a-summer-of-stars/9781538779286/' },
  { id: 'us-2026-tear-city-down', title: 'Tear the City Down', author: 'Andre Hardy', releaseDate: '2026-09-01', publisher: 'Grand Central Publishing', genre: 'kryminał', description: 'A hard-hitting crime novel of jazz, football, power, and a divided San Diego.', publisherUrl: 'https://www.hachettebookgroup.com/titles/andre-hardy/tear-the-city-down/9781538777503/' },
  { id: 'us-2026-zero-lives', title: 'Zero Lives Remaining', author: 'Adam Cesare', releaseDate: '2026-09-01', publisher: 'Union Square & Co.', genre: 'horror', description: 'Gamers face ghosts in a fast, bloody horror story set inside a video arcade.', publisherUrl: 'https://www.hachettebookgroup.com/titles/adam-cesare/zero-lives-remaining/9781454967712/' },
  { id: 'us-2026-thoroughbreds', title: 'The Thoroughbreds', author: 'Elin Hilderbrand & Shelby Cunningham', releaseDate: '2026-09-15', publisher: 'Little, Brown and Company', genre: 'young adult', description: 'Senior year at an elite boarding school brings pressure, ambition, parties, and secrets.', publisherUrl: 'https://www.hachettebookgroup.com/titles/elin-hilderbrand/the-thoroughbreds/9780316567947/' },
  { id: 'us-2026-american-hagwon', title: 'American Hagwon', author: 'Min Jin Lee', releaseDate: '2026-09-29', publisher: 'Cardinal', genre: 'literatura piękna', description: 'A sweeping contemporary epic about ambition, loyalty, family duty, and personal dreams.', publisherUrl: 'https://www.hachettebookgroup.com/titles/min-jin-lee/american-hagwon/9781538752036/' },
  { id: 'us-2026-thief-traitor-bride', title: 'The Thief and the Traitor Bride', author: 'V. L. Bovalino', releaseDate: '2026-09-29', publisher: 'Forever', genre: 'dark romans', description: 'Estranged spouses—a spy and a thief—are forced together in a dangerous epic romantasy.', publisherUrl: 'https://www.hachettebookgroup.com/titles/v-l-bovalino/the-thief-and-the-traitor-bride/9781538776599/' },
  { id: 'us-2026-flashback', title: 'Flashback', author: 'Iris Johansen & Roy Johansen', releaseDate: '2026-10-06', publisher: 'Grand Central Publishing', genre: 'thriller', description: 'A fast-paced suspense novel from bestselling thriller writers Iris and Roy Johansen.', publisherUrl: 'https://www.hachettebookgroup.com/titles/iris-johansen/flashback/9781538785720/' },
  { id: 'us-2026-tis-season-revenge', title: "'Tis the Season for Revenge", author: 'Morgan Elizabeth', releaseDate: '2026-10-06', publisher: 'Union Square & Co.', genre: 'romans', description: 'A festive revenge plan becomes an unexpectedly heartfelt romance.', publisherUrl: 'https://www.hachettebookgroup.com/titles/morgan-elizabeth/tis-the-season-for-revenge/9781454965794/' },
  { id: 'us-2026-new-moon-collector', title: 'New Moon: Deluxe Collector’s Edition', author: 'Stephenie Meyer', releaseDate: '2026-10-06', publisher: 'Little, Brown Books for Young Readers', genre: 'young adult', description: 'A deluxe collector’s edition of the second novel in the Twilight Saga.', publisherUrl: 'https://www.hachettebookgroup.com/titles/stephenie-meyer/new-moon-deluxe-collector%E2%80%99s-edition/9780316599399/' },
  { id: 'us-2026-queen-nothing-collector', title: 'The Queen of Nothing: Collector’s Edition', author: 'Holly Black', releaseDate: '2026-10-13', publisher: 'Alvina Ling Books', genre: 'young adult', description: 'A collector’s edition of the dark, romantic conclusion to The Folk of the Air.', publisherUrl: 'https://www.hachettebookgroup.com/titles/holly-black/the-queen-of-nothing-collectors-edition/9780316587563/' },
  { id: 'us-2026-heights', title: 'The Heights', author: 'Ian Rankin', releaseDate: '2026-11-03', publisher: 'Cardinal', genre: 'kryminał', description: 'A detective investigates a concierge’s murder in London’s most exclusive high rise.', publisherUrl: 'https://www.hachettebookgroup.com/titles/ian-rankin/the-heights/9781538776100/' },
  { id: 'us-2026-happily-murders', title: 'Happily Ever After the Murders', author: 'Rae Wilde', releaseDate: '2026-11-03', publisher: 'Legacy Lit', genre: 'thriller', description: 'Two elderly women go on the run when a decades-old double murder threatens to surface.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/happily-ever-after-the-murders/9781538784563/' },
  { id: 'us-2026-cut-ending', title: 'Cut to the Ending', author: 'Maria Millage', releaseDate: '2026-11-03', publisher: 'Little, Brown and Company', genre: 'romans', description: 'An aspiring screenwriter and a fantasy expert team up on a hit finale and fall for each other.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/cut-to-the-ending/9780316605991/' },
  { id: 'us-2026-all-in', title: 'All In', author: 'David Baldacci', releaseDate: '2026-11-10', publisher: 'Grand Central Publishing', genre: 'thriller', description: 'Travis Devine enters a conspiracy of weaponized data, espionage, and global power.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/david-baldacci-november-2026/9781538758090/' },
  { id: 'us-2026-i-dont-want-wait', title: "I Don't Want to Wait", author: 'Kerr Smith', releaseDate: '2026-11-10', publisher: 'Grand Central Publishing', genre: 'literatura faktu', description: 'A candid memoir from actor Kerr Smith about fame, change, and finding a new direction.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/i-dont-want-to-wait/9781538776650/' },
  { id: 'us-2026-too-cold-comfort', title: 'Too Cold for Comfort', author: 'Nisha J. Tuli', releaseDate: '2026-11-10', publisher: 'Forever', genre: 'romans', description: 'A winter romance from bestselling author Nisha J. Tuli.', publisherUrl: 'https://www.hachettebookgroup.com/titles/nisha-j-tuli/too-cold-for-comfort/9781538759288/' },
  { id: 'us-2026-firelight', title: 'Firelight', author: 'Kristen Callihan', releaseDate: '2026-11-10', publisher: 'Forever', genre: 'dark romans', description: 'A dark historical paranormal romance of secrets, danger, and forbidden attraction.', publisherUrl: 'https://www.hachettebookgroup.com/titles/kristen-callihan/firelight/9781538780503/' },
  { id: 'us-2026-vices-virtues', title: 'Vices & Virtues', author: 'Alexis L. Menard', releaseDate: '2026-11-24', publisher: 'Forever', genre: 'fantasy', description: 'A romantic fantasy of dangerous bargains, ambition, and desire.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/vices-and-virtues/9781538783962/' },
  { id: 'us-2026-scandal', title: 'Scandal', author: 'Navessa Allen', releaseDate: '2026-12-01', publisher: 'Forever', genre: 'dark romans', description: 'A seductive historical romance shaped by a marriage of convenience and dangerous secrets.', publisherUrl: 'https://www.hachettebookgroup.com/titles/navessa-allen/scandal/9781538784334/' },
  { id: 'us-2026-pray-safe', title: 'I Pray You Will Be Safe', author: 'Tala Albanna & Michelle Amzalak', releaseDate: '2026-12-01', publisher: 'Little, Brown and Company', genre: 'literatura faktu', description: 'Two young women write to each other across the Israel-Palestine divide.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/i-pray-you-will-be-safe/9780316613545/' },
  { id: 'us-2026-crime-fashion', title: 'A Crime of Fashion', author: 'Julie Mulhern', releaseDate: '2026-12-08', publisher: 'Forever', genre: 'kryminał', description: 'A 1920s Manhattan columnist investigates a disappearance among speakeasies and high society.', publisherUrl: 'https://www.hachettebookgroup.com/titles/none/a-crime-of-fashion/9781538773598/' },
]

function decode(value = '') {
  return value.replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"')
}

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

async function downloadCover(book) {
  const jpg = resolve(coverDir, `${book.id}.jpg`)
  const png = resolve(coverDir, `${book.id}.png`)
  if (await exists(jpg)) return `/covers-us/${book.id}.jpg`
  if (await exists(png)) return `/covers-us/${book.id}.png`

  const page = await fetch(book.publisherUrl, { headers: { 'user-agent': 'BookReleaseRadar/1.0' } })
  if (!page.ok) throw new Error(`${page.status} ${book.publisherUrl}`)
  const html = await page.text()
  const source = decode(
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] || ''
  )
  if (!source) throw new Error(`No cover for ${book.title}`)

  const response = await fetch(source, { redirect: 'follow', headers: { 'user-agent': 'BookReleaseRadar/1.0' } })
  if (!response.ok) throw new Error(`Cover ${response.status}: ${book.title}`)
  const extension = (response.headers.get('content-type') || '').includes('png') ? 'png' : 'jpg'
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 2500) throw new Error(`Cover too small: ${book.title}`)
  await writeFile(resolve(coverDir, `${book.id}.${extension}`), bytes)
  return `/covers-us/${book.id}.${extension}`
}

await mkdir(coverDir, { recursive: true })
const expanded = []
for (let index = 0; index < books.length; index += 5) {
  const batch = books.slice(index, index + 5)
  const results = await Promise.all(batch.map(async book => ({ ...book, cover: await downloadCover(book) })))
  expanded.push(...results)
  console.log(`Prepared ${Math.min(index + batch.length, books.length)}/${books.length} verified US releases`)
}

const current = JSON.parse(await readFile(dataPath, 'utf8'))
const ids = new Set(expanded.map(book => book.id))
const merged = [...current.filter(book => !ids.has(book.id)), ...expanded]
  .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.title.localeCompare(b.title, 'en'))
await writeFile(dataPath, `${JSON.stringify(merged, null, 2)}\n`)
console.log(`US catalog now contains ${merged.length} releases.`)
