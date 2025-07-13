# Lær daglig kantonesisk

En barnevennlig PWA (Progressive Web App) for å lære dagligdagse kantonesiske ord og setninger gjennom interaktive quiz.

## Funksjoner

- 🎯 Quiz-basert læring med flervalgssvar
- 🔊 Tekst-til-tale (TTS) for kantonesisk uttale
- 🖼️ Illustrerende ikoner fra The Noun Project API
- 📱 PWA-støtte for installasjon på mobil og desktop
- 🎨 Barnevennlig design
- 🌐 Gratis og åpen kildekode

## Teknologi

- React 18 med Vite
- PWA med Workbox
- Web Speech API for TTS
- The Noun Project API for ikoner
- CSS Grid og Flexbox for responsivt design

## Kjøring lokalt

1. Installer avhengigheter:
```bash
npm install
```

2. Opprett `.env` fil med API-nøkler for The Noun Project:
```
VITE_NOUN_PROJECT_KEY=din_api_nøkkel
VITE_NOUN_PROJECT_SECRET=din_api_hemmelighet
```

3. Start utviklingsserver:
```bash
npm run dev
```

4. Bygge for produksjon:
```bash
npm run build
```

## Eksempel på spørsmål

Appen presenterer kantonesiske ord som "唔該" (takk) og lar brukeren velge riktig norsk oversettelse fra flere alternativer med tilhørende ikoner.

## Lisens

MIT - Gratis og åpen kildekode
