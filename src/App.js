import React, { useState, useEffect, createContext, useContext } from "react";
import { GLOBAL_CSS } from "./styles";
import { usePlayer, useFeed } from "./hooks";
import { useAuth } from "./useAuth";
import { JOE_QUESTS, LIZ_QUESTS } from "./data";
import { WarriorAvatar, MageAvatar } from "./avatars";
import Landing     from "./components/Landing";
import PlayerBoard from "./components/PlayerBoard";
import SharedRealm from "./components/SharedRealm";
import ITLog        from "./components/ITLog";
import Login        from "./components/Login";
import Legend       from "./components/Legend";

// ─── Theme context ─────────────────────────────────────────────────────────────
export const ThemeCtx = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

// ─── Player resolution ─────────────────────────────────────────────────────────
const JOE_EMAIL = process.env.REACT_APP_JOE_EMAIL;
const LIZ_EMAIL = process.env.REACT_APP_LIZ_EMAIL;

function resolvePlayer(session) {
  if (!session) return null;
  const email = session.user.email;
  if (email === JOE_EMAIL) return "joe";
  if (email === LIZ_EMAIL) return "liz";
  return null;
}

// ─── Nav items per player ──────────────────────────────────────────────────────
const NAV_ALL = [
  { id: "landing", icon: "⚔️", label: "Home"    },
  { id: "joe",     icon: "🛡",  label: "Joe"     },
  { id: "liz",     icon: "✨", label: "Liz"     },
  { id: "shared",  icon: "🔮", label: "Realm"   },
  { id: "itlog",   icon: "🖥",  label: "IT Log"  },
  { id: "legend",  icon: "📜", label: "Legend"  },
];

const NAV_FOR = {
  joe: ["landing", "joe", "shared", "itlog", "legend"],
  liz: ["landing", "liz", "shared", "legend"],
};

// ─── Shared layout wrapper ─────────────────────────────────────────────────────
function Shell({ screen, setScreen, dark, toggleTheme, topTitle, topSub, navIds, onSignOut, children }) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const nav = NAV_ALL.filter(n => navIds.includes(n.id));

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">Q</div>
        <nav className="sidebar-nav">
          {nav.map(n => (
            <button
              key={n.id}
              className={`nav-item${screen === n.id ? " active" : ""}`}
              onClick={() => setScreen(n.id)}
              title={n.label}
            >
              {n.icon}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={toggleTheme} title={dark ? "Light mode" : "Dark mode"}>
            <div className="theme-toggle-thumb">{dark ? "☀️" : "🌙"}</div>
          </button>
          <button
            className="icon-btn"
            onClick={onSignOut}
            title="Sign out"
            style={{ marginTop: 8, fontSize: 16 }}
          >
            ↩
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-area">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-greeting">
            <div className="topbar-title">{topTitle}</div>
            <div className="topbar-sub">{topSub || todayName}</div>
          </div>
          <input className="topbar-search" placeholder="🔍  Search..." />
          <div className="topbar-actions">
            <button className="icon-btn" title="Notifications">🔔</button>
            <button className="icon-btn" title="Settings">⚙️</button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { session, loading, signIn, signOut } = useAuth();
  const [dark, setDark] = useState(false);

  const currentPlayer = resolvePlayer(session);

  const [screen, setScreen] = useState(() =>
    currentPlayer === "liz" ? "liz" : currentPlayer === "joe" ? "joe" : "landing"
  );

  // When auth state settles, jump to the player's own board
  useEffect(() => {
    if (currentPlayer === "joe") setScreen("joe");
    else if (currentPlayer === "liz") setScreen("liz");
  }, [currentPlayer]);

  const joePlayer = usePlayer(JOE_QUESTS, "Joe");
  const lizPlayer = usePlayer(LIZ_QUESTS, "Liz");
  const feed      = useFeed();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => setDark(d => !d);

  const TITLES = {
    landing: ["Quest Board",   "Your daily command center"],
    joe:     ["Joe's Board",   "Warrior · Daily Quests"],
    liz:     ["Liz's Board",   "Mage · Daily Quests"],
    shared:  ["Shared Realm",  "Feed · Stats · Leaderboard"],
    itlog:   ["IT Daily Log",  "Tickets · Notes · Handoff"],
    legend:  ["XP Legend",     "Quest guide & scoring reference"],
  };

  const [topTitle, topSub] = TITLES[screen] || TITLES.landing;
  const navIds = NAV_FOR[currentPlayer] || [];

  if (loading) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text2)", fontSize: 14 }}>
          Loading…
        </div>
      </>
    );
  }

  if (!session || !currentPlayer) {
    return (
      <ThemeCtx.Provider value={{ dark, toggle: toggleTheme }}>
        <style>{GLOBAL_CSS}</style>
        <Login signIn={signIn} />
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={{ dark, toggle: toggleTheme }}>
      <style>{GLOBAL_CSS}</style>

      <Shell
        screen={screen} setScreen={setScreen}
        dark={dark} toggleTheme={toggleTheme}
        topTitle={topTitle} topSub={topSub}
        navIds={navIds}
        onSignOut={signOut}
      >
        {screen === "landing" && (
          <Landing
            joeXP={joePlayer.earnedXP}      lizXP={lizPlayer.earnedXP}
            joeDone={joePlayer.doneCount}   lizDone={lizPlayer.doneCount}
            joeTotal={joePlayer.totalCount} lizTotal={lizPlayer.totalCount}
            currentPlayer={currentPlayer}
            onJoe={currentPlayer === "joe" ? () => setScreen("joe") : null}
            onLiz={currentPlayer === "liz" ? () => setScreen("liz") : null}
            onShared={() => setScreen("shared")}
            onITLog={currentPlayer === "joe" ? () => setScreen("itlog") : null}
          />
        )}

        {screen === "joe" && currentPlayer === "joe" && (
          <PlayerBoard
            player="Joe" color="#6a50d0"
            avatar={WarriorAvatar}
            playerHook={joePlayer}
            onBack={() => setScreen("landing")}
            onShared={() => setScreen("shared")}
            onITLog={() => setScreen("itlog")}
          />
        )}

        {screen === "liz" && currentPlayer === "liz" && (
          <PlayerBoard
            player="Liz" color="#c040a0"
            avatar={MageAvatar}
            playerHook={lizPlayer}
            onBack={() => setScreen("landing")}
            onShared={() => setScreen("shared")}
          />
        )}

        {screen === "shared" && (
          <SharedRealm
            joeXP={joePlayer.earnedXP}    lizXP={lizPlayer.earnedXP}
            joeDone={joePlayer.doneCount} lizDone={lizPlayer.doneCount}
            feedHook={feed}
            onBack={() => setScreen("landing")}
          />
        )}

        {screen === "itlog" && currentPlayer === "joe" && (
          <ITLog onBack={() => setScreen("landing")} />
        )}

        {screen === "legend" && <Legend />}
      </Shell>
    </ThemeCtx.Provider>
  );
}
