# Partiprogram app for Miljøpartiet De Grønne 2025

Denne applikasjonen inneholder arbeidsprogrammet til Miljøpartiet de Grønne for 2025-2029. Applikasjonen er utviklet på frivillig basis av Johannes Brodwall. Bidrag fra andre ønskes velkommen, spesielt rundt layout.

Målsetningen med applikasjonen er at frivillige i partiet skal bedre kunne svare på spørsmål fra velgere og at velgere kan finne viktig svar selv.

## Features

- Full tekst fra partiprogrammet
- Klikkbar og linkbar innholdsfortegnelse
- Tekstsøk som støtter delvis treff og søk på flere ord
- Deleknapp for kapittel, nummerert seksjon og programpunkt

## Teknologi

- React med React Router (hash router)
- [fuse.js](https://fusejs.io) for søk
- Deployment til GitHub pages med GitHub Actions
- Husky, Prettier og TypeScript for enklere utviklingsprosess

## Ønskeliste

- Underpunkter i innholdsfortegnelsen
- Nynorsk versjon av teksten

### Ønskede tekniske forbedringer

- Burde teksten vært en HTML-applikasjon istedet for JSON for å være optimalisert for søkemotor og språkmodeller?

## Datagrunnlag

- Programmet er lastet ned fra [offisiell versjon](https://docs.google.com/document/d/1gwy6H6RDN-zQNYnqmd8zWb0rqWUQ_rfXdrp1AnE6peI/edit?tab=t.0) på Google Docs som Markdown (File -> Download -> Markdown)
- Fila er manuelt renset for et par problemer (ekstra `\`-tegn og noen skjulte rare tegn)
- `npm run data` prosesserer teksten og lager `src/data/output.json`
- `src/data/document.ts` importerer teksten med `import data from "./output.json"`
