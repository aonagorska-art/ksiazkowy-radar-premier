# Książkowy Radar Premier

Prosty kalendarz polskich premier książkowych. Pokazuje daty, okładki, wydawnictwa oraz linki do stron wydawnictw i Empiku. Można filtrować premiery i zapisywać ulubione książki.

Strona: [ksiazkowy-radar-premier.netlify.app](https://ksiazkowy-radar-premier.netlify.app/)

## Uruchomienie

```sh
pnpm install
pnpm dev
```

Dane w `src/data/books.ts` pochodzą z oficjalnych kart wydawców. Codzienny workflow GitHub Actions sprawdza daty obecnych w katalogu premier, zachowuje ostatnią poprawną wartość przy czasowej awarii źródła i publikuje raport w `public/data/sync-report.json`.

Automatyzacja sprawdza zmiany dat pozycji już dodanych do katalogu. Nowe tytuły wymagają krótkiej weryfikacji redakcyjnej, ponieważ strony wydawców nie udostępniają jednego wspólnego formatu gatunków, opisów i serii.
