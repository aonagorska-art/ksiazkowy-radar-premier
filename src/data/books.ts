export type Genre = 'romans' | 'dark romans' | 'fantasy' | 'thriller' | 'kryminał' | 'literatura piękna' | 'young adult' | 'science fiction' | 'horror' | 'literatura faktu' | 'inne'
export type Book = { id: string; title: string; author: string; releaseDate: string; publisher: string; genre: Genre; description: string; cover: string; publisherUrl: string; series?: string; volume?: number }
export const genres: Genre[] = ['romans','dark romans','fantasy','thriller','kryminał','literatura piękna','young adult','science fiction','horror','literatura faktu','inne']
export const publishers = ['Wydawnictwo Poznańskie','Wydawnictwo Albatros','Wydawnictwo Jaguar','Wydawnictwo NieZwykłe','Wydawnictwo NieZwykłe Zagraniczne','Czwarta Strona','Znak Literanova','Moondrive','Uroboros']

type Source = 'p' | 'a'
function entry(source: Source, slug: string, title: string, author: string, releaseDate: string, genre: Genre, description: string, series?: string, volume?: number): Book {
 return {
  id: slug, title, author, releaseDate, genre, description, series, volume,
  publisher: source === 'p' ? publishers[0] : publishers[1],
  cover: `/covers-real/${slug}.${slug === 'krol-smutek' ? 'png' : 'jpg'}`,
  publisherUrl: source === 'p'
   ? `https://wydawnictwopoznanskie.pl/produkt/${slug}/`
   : `https://www.wydawnictwoalbatros.com/ksiazki/${slug}/`
 }
}

function verified(id: string, title: string, author: string, releaseDate: string, publisher: string, genre: Genre, description: string, publisherUrl: string, extension = 'jpg', series?: string, volume?: number): Book {
 return {id,title,author,releaseDate,publisher,genre,description,publisherUrl,cover:`/covers-real/${id}.${extension}`,series,volume}
}

// Zweryfikowano na kartach wydawców 22.09.2026. Jest to wybrany katalog, nie pełna lista premier rynku.
export const books: Book[] = [
 entry('p','polskosc-prawdziwa-historia-tego-kim-jestesmy','Polskość. Prawdziwa historia tego, kim jesteśmy','Kamil Janicki','2026-09-09','literatura faktu','Kamil Janicki analizuje polski charakter przez pryzmat historii i współczesnych badań.'),
 entry('p','o-objetosci-czasu-i','O objętości czasu I','Solvej Balle','2026-09-09','literatura piękna','Tara Selter utknęła w pętli czasu: każdy dzień jest ponownie osiemnastym listopada.','O objętości czasu',1),
 entry('a','chlopiec-ktory-przegral-wojne','Chłopiec, który przegrał wojnę','Julia Navarro','2026-09-09','literatura piękna','Powieść o chłopcu rozdartym między dwiema rodzinami i krajami w cieniu wojny domowej w Hiszpanii.'),
 entry('a','krol-smutek','Król Smutek','Joe Hill','2026-09-09','horror','Sześcioro przyjaciół zawiera pakt, który na zawsze odmieni ich życie.'),
 entry('a','okruchy-dnia-2','Okruchy dnia','Kazuo Ishiguro','2026-09-11','literatura piękna','Kamerdyner Stevens wyrusza w podróż i mierzy się z własną przeszłością oraz utraconymi szansami.'),
 entry('p','narod-do-zadan-specjalnych','Naród do zadań specjalnych','Bartłomiej Sienkiewicz, Hanna Gill-Piątek','2026-09-23','literatura faktu','Autorzy pytają, dlaczego polskie sukcesy technologiczne nie przekładają się na sprawniejsze państwo.'),
 entry('p','john-syn-johna','John, syn Johna','Douglas Stuart','2026-09-23','literatura piękna','John-Calum wraca w rodzinne strony. Relacja z ojcem wystawia na próbę kruchy porządek ich życia.'),
 entry('p','miasto-przyszlosci-jak-technologia-odmieni-nasze-zycie','Miasto przyszłości. Jak technologia zmienia nasze życie','Magdalena Milert','2026-09-23','literatura faktu','Urbanistka analizuje, jak dane, algorytmy i nowe technologie zmieniają wspólną przestrzeń.'),
 entry('a','cienie-przeszlosci','Cienie przeszłości','Tess Gerritsen','2026-09-23','thriller','Dawna misja CIA powraca, gdy podczas konferencji dochodzi do morderstwa.','Klub Martini',3),
 entry('a','niecodzienne-przypadki-dennyego-vossa','Niecodzienne przypadki Denny’ego Vossa','Holly Kennedy','2026-09-23','literatura piękna','Denny próbuje udowodnić niewinność w sprawie o morderstwo i odkrywa prawdę o sobie oraz bliskich.'),
 entry('a','nie-opuszczaj-mnie','Nie opuszczaj mnie','Kazuo Ishiguro','2026-10-07','literatura piękna','Uczniowie ekskluzywnej szkoły stopniowo odkrywają przerażającą prawdę o swoim przeznaczeniu.'),
 entry('p','lumpy-co-sie-czai-w-second-handach','Lumpy. Co się czai w second handach','Przemek Srogosz','2026-10-14','literatura faktu','Opowieść o świecie lumpeksów, jakości ubrań i kosztach szybkiej mody.'),
 entry('a','zaproszenie','Zaproszenie','Sebastian Fitzek','2026-10-14','thriller','Marla przyjeżdża na zjazd absolwentów w Alpach i odkrywa, że znalazła się w pułapce.'),
 entry('a','klara-i-slonce','Klara i Słońce. Wydanie filmowe','Kazuo Ishiguro','2026-10-14','science fiction','Klara, Sztuczna Przyjaciółka, obserwuje ludzi i uczy się rozumieć ich uczucia.'),
 entry('a','syn-nikogo','Syn nikogo','Yann Martel','2026-10-14','literatura piękna','Nowe spojrzenie na wojnę trojańską przez losy żołnierza i współczesnego uczonego.'),
 entry('a','ale-mam-szczescie','Ale mam szczęście','Christian Watson','2026-10-28','inne','Ilustrowana opowieść o szkielecie, który odkrywa, co składa się na wartościowe życie.'),
 entry('a','ostatnia-corka','Ostatnia córka','Soraya Lane','2026-10-28','romans','Finał serii Utracone Córki: rodzinna tajemnica, miłość i podróż do Paryża i Londynu.','Utracone Córki',8),
 entry('a','obsesja','Obsesja','B.A. Paris','2026-10-28','thriller','Nell ma wrażenie, że ktoś ją obserwuje i odkrył jej nową tożsamość.'),
 entry('p','yesteryear','Yesteryear','Caro Claire Burke','2026-10-28','literatura piękna','Popularna tradwife Natalie budzi się w życiu, które wydaje się znajome, lecz nie jest jej własnym.'),
 entry('a','sciana-sekretow-wiem-kto-go-zabil','Ściana sekretów. Wiem, kto go zabił','Tana French','2026-11-12','kryminał','Kolejna odsłona cyklu Zbrodnie Dublina: śledztwo w sprawie dawnej zbrodni.'),
 entry('a','ostatni-intruz','Ostatni intruz','Tana French','2026-11-25','kryminał','Detektyw Antoinette Conway prowadzi pozornie rutynowe śledztwo, które szybko staje się niepokojące.'),
 verified('jaguar-dziewczyna-z-osady','Dziewczyna z osady','Sheila McClure','2026-09-23','Wydawnictwo Jaguar','young adult','Teagan chce wrócić do wioślarstwa i trafia do męskiej drużyny w prestiżowej szkole.','https://wydawnictwo-jaguar.pl/sklep/produkt/1255/dziewczyna-z-osady'),
 verified('jaguar-dziedzictwo-mroku','Dziedzictwo mroku','Kathryn Foxfield','2026-09-23','Wydawnictwo Jaguar','fantasy','Rodzina Winterów skrywa pakt z diabłem. Cicely musi odkryć, kto zagraża jej bliskim.','https://wydawnictwo-jaguar.pl/sklep/produkt/1251/dziedzictwo-mroku'),
 verified('jaguar-gdy-zostanie-tylko-popiol','Gdy zostanie tylko popiół. Niezwiązana. Tom 3','Monika Sławik','2026-09-30','Wydawnictwo Jaguar','fantasy','Lavender i Storm stają wobec wojny oraz tajemnicy, która może zerwać ich Więź.','https://wydawnictwo-jaguar.pl/sklep/produkt/1256/gdy-zostanie-tylko-popiol-niezwiazana-tom-3','png','Niezwiązana',3),
 verified('jaguar-do-czego-jestes-zdolna','Do czego jesteś zdolna','Amy Goldsmith','2026-10-28','Wydawnictwo Jaguar','horror','Nad jeziorem przy Wren Hall kryje się coś niepokojącego. Młodzieżowy horror o mrocznej przeszłości.','https://wydawnictwo-jaguar.pl/sklep/produkt/1258/do-czego-jestes-zdolna','png'),
 verified('niezwykle-sluby-i-pogrzeby','Śluby i pogrzeby','Julia Kubicka','2026-09-23','Wydawnictwo NieZwykłe','romans','Jamie próbuje ułożyć sobie życie, lecz powrót Sama wywraca jego plany.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/sluby-i-pogrzeby','webp','Konwenanse',1),
 verified('niezwykle-tarantula','Tarantula','J. Clarineste','2026-09-30','Wydawnictwo NieZwykłe','dark romans','Po śmierci brata Cassandra szuka zemsty, lecz sama staje się celem płatnego zabójcy.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/tarantula','webp'),
 verified('niezwykle-zagraniczne-grzech-i-odkupienie','Grzech i odkupienie','Cora Reilly','2026-09-24','Wydawnictwo NieZwykłe Zagraniczne','dark romans','Tragiczny wypadek łączy Sarę z Maximusem, ochroniarzem Famiglii.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/grzech-i-odkupienie','webp'),
 verified('niezwykle-zagraniczne-poszukiwane-schronienie','Poszukiwane schronienie','Catherine Cowles','2026-10-01','Wydawnictwo NieZwykłe Zagraniczne','romans','Nowy start w Sparrow Falls komplikuje znajomość z nadopiekuńczym sąsiadem Trace’em.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/poszukiwane-schronienie','webp','Sparrow Falls',5),
 verified('niezwykle-dom-kier','Dom Kier','Skyla Arndt','2026-09-29','Wydawnictwo NieZwykłe','fantasy','Vi trafia do szkoły skrywającej śmiertelną klątwę i tajemnice, od których niełatwo uciec.','https://wydawnictwoniezwykle.pl/fantasy/dom-kier','webp'),
 verified('niezwykle-maroon','Maroon','Letycja Wileńska','2026-09-30','Wydawnictwo NieZwykłe','romans','Druga część serii Burning Red: relacje bohaterów stają się coraz bardziej skomplikowane.','https://wydawnictwoniezwykle.pl/new-adult-2/maroon','webp','Burning Red',2),
 verified('niezwykle-reckless-titan','Reckless Titan','Karolina Rowińska','2026-10-07','Wydawnictwo NieZwykłe','romans','Szkolny rugbysta Griffin i Jordan zawierają układ, którego finału żadne z nich nie przewiduje.','https://wydawnictwoniezwykle.pl/new-adult-2/reckless-titan','webp','Crownridge Titans',1),
 verified('niezwykle-off-script','Off-Script','Ula Buchacz','2026-10-07','Wydawnictwo NieZwykłe','romans','Aktorka Romy i dziedzic filmowego imperium Tate udają parę, choć nic nie idzie zgodnie ze scenariuszem.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/off-script','webp'),
 verified('niezwykle-klamcy-tacy-jak-my','Kłamcy tacy jak my','J.T. Geissinger','2026-10-08','Wydawnictwo NieZwykłe','dark romans','Pierwsza część serii Morally Gray: niebezpieczne sekrety splatają losy bohaterów.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/klamcy-tacy-jak-my','webp','Morally Gray',1),
 verified('niezwykle-corka-smierci','Córka Śmierci','S.A. Barnes','2026-10-13','Wydawnictwo NieZwykłe','fantasy','Fantastyczna opowieść otwierająca cykl Dzieci Pradawnych.','https://wydawnictwoniezwykle.pl/fantasy/corka-smierci','webp','Dzieci Pradawnych',1),
 verified('niezwykle-two-million-ways','Two Million Ways','Joanna Chwistek','2026-10-14','Wydawnictwo NieZwykłe','romans','Nowa powieść Joanny Chwistek o uczuciach i wyborach, które zmieniają życie.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/two-million-ways','webp'),
 verified('niezwykle-the-golden-raven','The Golden Raven','Nora Sakavic','2026-10-15','Wydawnictwo NieZwykłe','young adult','Jean Moreau i Trojanie z USC walczą o mistrzostwo w kolejnej odsłonie All for the Game.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/the-golden-raven','webp','All for the Game',5),
 verified('niezwykle-fairydale','Fairydale','Veronica Lancet','2026-10-20','Wydawnictwo NieZwykłe','fantasy','Darcy otrzymuje wiadomość o śmierci biologicznego ojca i odkrywa, że uwzględnił ją w testamencie.','https://wydawnictwoniezwykle.pl/fantasy/fairydale','webp'),
 verified('niezwykle-dziedzice','Dziedzice','Natalia Antczak','2026-10-21','Wydawnictwo NieZwykłe','young adult','Veronica Carlton odkrywa, że jej uprzywilejowane życie skrywa niebezpieczną tajemnicę.','https://wydawnictwoniezwykle.pl/young-adult/dziedzice','webp','Dziedzice',1),
 verified('niezwykle-braving-the-storm','Braving the Storm','Elliott Rose','2026-10-22','Wydawnictwo NieZwykłe','dark romans','Drugi tom cyklu Crimson Ridge.','https://wydawnictwoniezwykle.pl/romans-i-erotyka/braving-the-storm','webp','Crimson Ridge',2),
 verified('czwarta-one-nadal-krzycza','One nadal krzyczą','Klaudia Muniak','2026-09-23','Czwarta Strona','thriller','Martwy mężczyzna i zaginiony świadek prowadzą do krzywd z przeszłości.','https://czwartastrona.pl/produkt/one-nadal-krzycza/'),
 verified('czwarta-ukochana-zona','Ukochana żona','Freida McFadden','2026-09-23','Czwarta Strona','thriller','Nowa opiekunka odkrywa, że sparaliżowana Victoria żyje w strachu.','https://czwartastrona.pl/produkt/ukochana-zona/'),
 verified('znak-lowcy-bolu','Łowcy bólu','Bora Chung','2026-09-23','Znak Literanova','literatura piękna','Tajemnicza sekta uznaje ból za fundament człowieczeństwa.','https://www.znak.com.pl/p/lowcy-bolu-bora-chung-489000'),
 verified('znak-budujac','Budując. Autobiografia Grażyny Kulczyk','Grażyna Kulczyk','2026-10-28','Znak Literanova','literatura faktu','Autobiografia kolekcjonerki sztuki i współtwórczyni poznańskiego Starego Browaru.','https://www.znak.com.pl/p/budujac-autobiografia-grazyny-kulczyk-grazyna-kulczyk-492745'),
 verified('moondrive-krolowa-roz','Królowa róż. Wydanie specjalne','Sasha Peyton Smith','2026-09-23','Moondrive','fantasy','Ivy Benton musi odnaleźć sposób, by obalić króla wróżek i ocalić bliskich.','https://www.znak.com.pl/p/krolowa-roz-wydanie-specjalne-sasha-peyton-smith-492434'),
 verified('uroboros-ksiega-utraconych-godzin','Księga utraconych godzin','Hayley Gelfuso','2026-09-23','Uroboros','fantasy','Lisavet trafia do biblioteki wspomnień zmarłych i odkrywa, że ktoś próbuje zmienić historię.','https://www.gwfoksal.pl/ksiega-utraconych-godzin-hayley-gelfuso-skua7959a5cc77fea823a2c.html','webp'),
 verified('uroboros-dwor-rozbitej-harmonii','Cykl Walkirii. Dwór rozbitej harmonii. Tom 6','Sarah J. Maas','2026-11-11','Uroboros','fantasy','Prythian próbuje odbudować sojusze wobec zagrożenia ze strony Kościeja Nieśmiertelnego.','https://www.gwfoksal.pl/cykl-walkirii-dwor-rozbitej-harmonii-tom-6-sarah-j-maas-sku26ee94f57627ac2f512d.html','webp','Dwór cierni i róż',6)
]
