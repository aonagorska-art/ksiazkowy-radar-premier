# Książkowy Radar Premier

Dwujęzyczny kalendarz premier książkowych dla Polski i USA. Pokazuje daty, autorskie grafiki zastępcze, wydawnictwa oraz linki do stron wydawnictw i sklepów. Można filtrować premiery i zapisywać ulubione książki. Każdy rynek ma własny katalog i motyw kolorystyczny.

Strona: [ksiazkowy-radar-premier.netlify.app](https://ksiazkowy-radar-premier.netlify.app/)

## Uruchomienie

```sh
pnpm install
pnpm dev
```

Dane pochodzą z oficjalnych kart wydawców. Codzienny workflow GitHub Actions:

- sprawdza daty premier zapisanych w katalogu,
- przegląda mapy stron wydawnictw i wykrywa nowe tytuły,
- ustala tytuł, autora, datę i kategorię,
- usuwa duplikaty i zachowuje ostatnie poprawne dane przy czasowej awarii źródła,
- zapisuje automatycznie wykryte pozycje w `public/data/auto-books.json`.
- przeszukuje także amerykańskie wydawnictwa i aktualizuje `public/data/us-books.json`.

Ręczny katalog pozostaje źródłem nadrzędnym. Automatycznie wykryte książki są do niego dołączane podczas uruchamiania aplikacji.

## Prawa do materiałów

Aplikacja nie publikuje reprodukcji okładek. Zamiast nich generuje własne grafiki typograficzne z tytułem, autorem i kolorem kategorii. Tytuły, nazwiska autorów, nazwy wydawnictw oraz znaki towarowe pozostają własnością odpowiednich uprawnionych podmiotów. Szczegóły znajdują się w pliku [THIRD_PARTY_NOTICE.md](THIRD_PARTY_NOTICE.md).
