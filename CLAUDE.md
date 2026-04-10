# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server (Create React App)
npm run build    # Production build → build/
npm test         # Run tests
```

Deployed to Vercel via GitHub push (auto-detects CRA, runs `npm run build`).

## What This App Is

Quest Board — a gamified daily productivity tracker built specifically for two users: Joe and Liz (a couple). Players complete daily quests, earn XP, and level up. It's a full-stack React + Supabase SPA.

## Architecture

**Stack:** React 18 (Create React App), inline styles + global CSS string, Supabase for auth/persistence, Vercel for hosting.

**Player identity** is determined by the authenticated Supabase email (`REACT_APP_JOE_EMAIL` / `REACT_APP_LIZ_EMAIL`). There are exactly two players; no registration flow.

**State management** uses two custom hooks in `src/hooks.js`:
- `usePlayer(presetMap, playerName)` — manages one player's entire day: quests by section, completion (`done`), XP metrics, intention/closing note. Dual-layer persistence: localStorage (instant) → Supabase debounced at 1.5s.
- `useFeed()` — manages the shared activity feed (posts array + `addPost`).

**Data flow:**
```
App.js
  usePlayer(JOE_QUESTS, "joe")   → joePlayer
  usePlayer(LIZ_QUESTS, "liz")   → lizPlayer
  useFeed()                       → feed
  ↓
Screen components receive these as props
```

**Routing** is manual state in `App.js` (`screen` variable). No React Router. Screens: `landing`, `joe`, `liz`, `shared`, `itlog` (Joe only), `legend`.

**Supabase tables:**
- `player_day` — daily state per player: quests array, intention, closing note, done_titles
- `quest_logs` — completion records (player, quest_id, xp_earned, date)

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks.js` | Core state logic — read this first for any data/persistence work |
| `src/data.js` | All constants: quest presets per day/player, sections, XP level thresholds |
| `src/App.js` | Root: auth gate, theme context, screen router, shell layout |
| `src/styles.js` | All styling as `GLOBAL_CSS` string + inline style objects — no CSS files |
| `src/supabase.js` | Supabase client init (graceful fallback if env vars missing) |
| `src/useAuth.js` | Magic-link email auth hook |

## Styling Conventions

All styles live in `src/styles.js` as either:
- **`GLOBAL_CSS`** string — injected via `<style>` tag, uses CSS custom properties for theming
- **Inline style objects** — defined in component files

No Tailwind, no CSS modules, no `.css` files. Theme (light/dark) is provided via `ThemeCtx` context and CSS variables (`--bg`, `--card`, `--accent`, etc.).

## Environment Variables

```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_JOE_EMAIL
REACT_APP_LIZ_EMAIL
```

## Quest Data Structure

Each quest has: `id`, `title`, `desc`, `xp`, `type`, `section`, optionally `boss: true`. Quests are organized by section (`morning`, `work`, `learning`, `personal`, `closing`). `JOE_QUESTS` and `LIZ_QUESTS` in `data.js` are arrays indexed by day of week (0–6).

## Compact Preservation Rules
When compacting, always preserve:
- File paths I've modified
- Current test failures
- Active debugging hypotheses