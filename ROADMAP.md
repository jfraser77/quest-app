# Full Stack Roadmap — Quest Board App

---

## PHASE 1 — What You Have Now (Frontend Foundation)

The current app is a well-structured React SPA (Single Page Application).
It already demonstrates real portfolio skills:

**What's already interview-worthy:**
- Component architecture (separation of concerns across files)
- Custom hooks (`usePlayer`, `useFeed`) — state abstraction
- Props-driven components with clear interfaces
- Responsive design without a CSS framework
- Conditional rendering across multiple screen states

---

## PHASE 2 — Add a Backend (Next.js Migration)

**Why Next.js?** It's what Vercel is built for. It handles both your
frontend AND your API routes in one project.

### Step 1: Migrate to Next.js

```bash
# In a new folder
npx create-next-app@latest quest-app-next
# Choose: App Router, TypeScript (optional), Tailwind (optional)
```

Move your components into `app/` or `components/`.
Your screens become pages (`app/page.js`, `app/joe/page.js`).

### Step 2: Add a Database (Supabase — free tier)

Supabase is PostgreSQL with a REST API, auth, and realtime built in.
It's the fastest path from zero to a real database.

```
Tables to create:
- users          (id, name, player_class, created_at)
- quests         (id, user_id, title, desc, xp, type, section, day, boss, created_at)
- quest_logs     (id, user_id, quest_id, completed_at, xp_earned)
- feed_posts     (id, user_id, prompt, answer, created_at)
- intentions     (id, user_id, text, date)
```

```bash
npm install @supabase/supabase-js
```

### Step 3: Add API Routes (Next.js App Router)

```
app/
└── api/
    ├── quests/
    │   ├── route.js        # GET all quests, POST new quest
    │   └── [id]/route.js   # PATCH (update), DELETE
    ├── logs/
    │   └── route.js        # POST when quest completed
    └── feed/
        └── route.js        # GET posts, POST new post
```

Each route is just an async function — Claude Code handles writing these fast.

### Step 4: Add Authentication (Supabase Auth)

```bash
npm install @supabase/auth-helpers-nextjs
```

- Joe and Liz each get their own login
- Protected routes — each player only sees their own quests
- Magic link login (no passwords needed)

---

## PHASE 3 — Claude Code Integration (Your Superpower)

This is where your IT + coding background becomes a genuine differentiator.

### How to use Claude Code on this project:

```bash
# Install Claude Code (requires Node 18+)
npm install -g @anthropic-ai/claude-code
cd quest-app-next
claude
```

### What to ask Claude Code to do:

```
"Add a Supabase integration to save quest completions to the database"
"Create an API route that returns today's quests for a given user"
"Refactor the usePlayer hook to fetch quests from the API instead of local state"
"Add optimistic UI updates when a quest is toggled"
"Write tests for the usePlayer hook"
```

### Claude Code best practices:
- Always describe the GOAL, not just the code change
- Reference the file you want changed: "In src/hooks.js, add..."
- Ask it to explain what it changed and why
- Commit after each working change — never let it build too far ahead

---

## PHASE 4 — Features to Add (Portfolio-Worthy)

Each of these is a talking point in an interview:

| Feature | Skills Demonstrated |
|---|---|
| Persistent quest completion (DB) | Full stack data flow |
| Weekly XP chart | Data visualization |
| Push notifications (daily quest reminder) | Web APIs, scheduling |
| PWA (installable on phone) | Progressive Web App concepts |
| Realtime leaderboard (Supabase Realtime) | WebSockets / realtime data |
| Quest streak tracking (across days) | Date logic, data modeling |
| Export/share board as image | Canvas API |
| Admin view (add quests from dashboard) | CRUD, role-based access |

---

## WHAT TO EXPECT IN A SOFTWARE INTERVIEW

### For a Junior/Mid Frontend or Full Stack role:

**What they'll ask about this project:**

1. "Walk me through how you structured your components."
   → Talk about separation of concerns: data.js, hooks.js, components/.
   → "I put all state logic into custom hooks so components stay clean."

2. "What's a custom hook? Why did you use one?"
   → "A custom hook extracts stateful logic so multiple components can
      share it without prop drilling. usePlayer manages one player's
      entire state — quests, completions, XP — so the board component
      just calls it and gets what it needs."

3. "How would you persist this data?"
   → Talk through the Phase 2 plan above. Even if you haven't built it,
      showing you know the path is half the answer.

4. "How do you handle state between components?"
   → "Right now, App.js owns shared state (joePlayer, lizPlayer) and
      passes it down as props. As it scales I'd move to Context or
      Zustand to avoid prop drilling."

5. "What would you do differently if you built this again?"
   → "I'd start with Next.js and TypeScript from day one, and define
      my data models before writing any UI."

### Portfolio presentation tips:
- Host it on Vercel — have a live URL ready
- Record a 90-second Loom walkthrough of the app
- Show the GitHub repo — recruiters look at commit history
- Have one "hard problem" story ready: something that broke, how you debugged it

---

## SKILL BUILD RECOMMENDATIONS

### Priority 1 — JavaScript Fundamentals (fills gaps fast)
- **Resource:** javascript.info (free, comprehensive)
- **Focus:** async/await, array methods (.map, .filter, .reduce), closures
- **Why:** Every interview tests these. Your quest data transformations already use them.

### Priority 2 — TypeScript (makes you more hireable immediately)
- **Resource:** Total TypeScript by Matt Pocock (free tier)
- **How to add it:** Rename `hooks.js` → `hooks.ts`, add types to your quest objects
- **Interview line:** "I refactored the project to TypeScript to catch errors at compile time"

### Priority 3 — Next.js (unlocks full stack)
- **Resource:** nextjs.org/learn (official, free, excellent)
- **Time:** ~2 weeks to be comfortable
- **Why:** Vercel + Next.js is the modern standard for this type of app

### Priority 4 — SQL / Supabase (the backend)
- **Resource:** mode.com/sql-tutorial (free)
- **Focus:** SELECT, JOIN, INSERT, WHERE — that's 80% of what you need
- **Project application:** Design the quest_logs table, write the query
  that returns "total XP earned this week per user"

### Priority 5 — Git / GitHub discipline (career signal)
- Commit after every working feature with a clear message
- Use branches: `git checkout -b feature/supabase-integration`
- Write a proper README (you already have one)
- **Recruiters look at commit history** — messy history = junior signal

---

## COMBINING SKILLS IN THIS PROJECT

Here's how to build each skill INTO the quest app:

```
TypeScript    → Add types to Quest, Player, FeedPost objects
Next.js       → Migrate, add /api/quests route
Supabase      → Save completions, load quests from DB
SQL           → Write the "weekly XP leaderboard" query
Git           → Branch per feature, PR into main
Testing       → Write tests for usePlayer hook with Jest
CSS/Tailwind  → Replace inline styles with Tailwind classes
```

By the time you complete Phase 3 of this roadmap, you have:
- A live, deployed full stack app
- Auth, database, API routes
- AI-assisted development workflow (Claude Code)
- A real story to tell in any junior-to-mid dev interview

That combination — practical app, real data, AI tooling — is uncommon
at the entry level and stands out immediately.
