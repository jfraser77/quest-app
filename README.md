# Quest Board — Full Stack App

A gamified daily productivity and relationship app for Joe & Liz.

## Tech Stack (Current)
- React 18 (Create React App)
- CSS-in-JS (inline styles + global CSS string)
- Deployed via Vercel

## Project Structure

```
src/
├── App.js              # Root — screen router
├── index.js            # React entry point
├── data.js             # All constants, quest presets, feed prompts
├── hooks.js            # usePlayer, useFeed — all state logic
├── avatars.js          # SVG avatar components
├── styles.js           # Global CSS + shared style objects
└── components/
    ├── Landing.js      # Home screen with leaderboard
    ├── PlayerBoard.js  # Combined play/edit board per player
    ├── QuestCard.js    # QuestCard (play) + QuestEditor (edit)
    └── SharedRealm.js  # Feed, stats, prompts
```

## Run Locally

```bash
npm install
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Hit Deploy — auto-detected as Create React App

## Next Steps (Full Stack Roadmap)

See ROADMAP.md
