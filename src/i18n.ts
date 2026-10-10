import type { Genre } from './data/books'

export type Language = 'pl' | 'en'

const genreLabels: Record<Language, Record<Genre, string>> = {
 pl: {'romans':'romans','dark romans':'dark romans','fantasy':'fantasy','thriller':'thriller','kryminał':'kryminał','literatura piękna':'literatura piękna','young adult':'young adult','science fiction':'science fiction','horror':'horror','literatura faktu':'literatura faktu','inne':'inne'},
 en: {'romans':'romance','dark romans':'dark romance','fantasy':'fantasy','thriller':'thriller','kryminał':'crime','literatura piękna':'literary fiction','young adult':'young adult','science fiction':'science fiction','horror':'horror','literatura faktu':'nonfiction','inne':'other'}
}

export const genreLabel = (genre: Genre, language: Language) => genreLabels[language][genre]
export const localeFor = (language: Language) => language === 'pl' ? 'pl-PL' : 'en-US'
export const appName = (language: Language) => language === 'pl' ? 'Książkowy Radar Premier' : 'Book Release Radar'
