# PersonalCinema

PersonalCinema is a lightweight movie and TV series journal. Log what you watched, rate it, and get simple suggestions based on the genres and directors you rate highly.

## Features

- Add movies and series with title, director, genre, a 1–10 rating, and watch date
- Keep the collection in browser `localStorage` between visits
- Remove entries, filter by format, and sort by date, rating, or title
- See collection counts and taste prompts based on titles rated 8 or higher
- Responsive layout for desktop and mobile screens

The recommendations are descriptive prompts (for example, exploring a favorite genre or director). The app does not connect to a movie database or generate a list of specific titles.

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Tech stack

- React 18 with hooks
- Vite 6 for the development server and production build
- Browser `localStorage` for persistence; no backend or account system
- Plain CSS for the responsive interface
- Google Fonts (DM Sans and Playfair Display) are loaded from Google Fonts when online; system sans-serif and serif fallbacks are provided

## Data and privacy

Entries are stored in the current browser profile on the current device. They are not synchronized across browsers or devices. Clearing site data removes the collection. The app does not require API keys or other secrets.

## Source

This repository version is a runnable React/Vite project based on the published [Claude artifact](https://claude.ai/public/artifacts/362808f4-b975-47ce-aff2-bd12058a58d8). It keeps the artifact's core tracking workflow and corrects the recommendation threshold to use the 1–10 rating scale consistently.

