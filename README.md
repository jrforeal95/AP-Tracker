# Angpao Tracker

A mobile-first PWA for tracking your Chinese New Year red packet (angpao) collection. Photograph unopened angpao, log amounts as you open them, and view a beautiful year-end recap of your CNY haul.

## Features

**Track & Log**
- Record angpao with amount, giver name, category, and generation (chor)
- Quick-add amount presets or custom input
- Smart contact suggestions from past entries

**Angpao Queue**
- Photograph unopened angpao before opening them
- Tag each with the giver's name
- Review the queue later — open each one, enter the amount, and it gets added to your tracker

**Dashboard & Stats**
- Total collection amount with daily trend chart
- Top givers ranking with tier badges
- Category and generation breakdowns
- Daily average and projection stats

**Year Recap**
- Instagram Stories-style recap with 6 themed pages
- Tap to navigate through your stats, top givers, categories, and biggest angpao
- Save each page as a shareable image (1080x1920)

**Extras**
- Bilingual: English and Chinese
- Offline-capable PWA — installable on mobile home screen
- Export/import data as JSON backup
- All data stored locally — no account needed, no server

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- Chart.js + react-chartjs-2
- vite-plugin-pwa (Workbox)
- html2canvas (code-split)
- LocalStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on your phone or browser.

## Build

```bash
npm run build
```

Output goes to `dist/` — deploy to Vercel, Netlify, or any static host.

## License

MIT
