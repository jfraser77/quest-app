import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { GLOBAL_CSS } from "./styles";
import { usePlayer, useFeed, UsePlayerReturn, UseFeedReturn } from "./hooks";
import { useAuth } from "./useAuth";
import { JOE_QUESTS, LIZ_QUESTS } from "./data";
import { WarriorAvatar, MageAvatar } from "./avatars";
import Landing     from "./components/Landing";
import PlayerBoard from "./components/PlayerBoard";
import SharedRealm from "./components/SharedRealm";
import ITLog        from "./components/ITLog";
import Login        from "./components/Login";
import Legend       from "./components/Legend";

// ─── Screen type ───────────────────────────────────────────────────────────────
type Screen = "landing" | "joe" | "liz" | "shared" | "itlog" | "legend";

// ─── Theme context ─────────────────────────────────────────────────────────────
interface ThemeCtxValue { dark: boolean; toggle: () => void; }
export const ThemeCtx = createContext<ThemeCtxValue>({ dark: false, toggle: () => {} });
export const useTheme = (): ThemeCtxValue => useContext(ThemeCtx);

// ─── Player resolution ─────────────────────────────────────────────────────────
const JOE_EMAIL = process.env.REACT_APP_JOE_EMAIL;
const LIZ_EMAIL = process.env.REACT_APP_LIZ_EMAIL;

type CurrentPlayer = "joe" | "liz" | null;

function resolvePlayer(session: any): CurrentPlayer {
  if (!session) return null;
  const email: string = session.user.email;
  if (email === JOE_EMAIL) return "joe";
  if (email === LIZ_EMAIL) return "liz";
  return null;
}

// ─── Nav items ─────────────────────────────────────────────────────────────────
interface NavItem { id: Screen; icon: string; label: string; }

const NAV_ALL: NavItem[] = [
  { id: "landing", icon: "⚔️", label: "Home"   },
  { id: "joe",     icon: "🛡",  label: "Joe"    },
  { id: "liz",     icon: "✨", label: "Liz"    },
  { id: "shared",  icon: "🔮", label: "Realm"  },
  { id: "itlog",   icon: "🖥",  label: "IT Log" },
  { id: "legend",  icon: "📜", label: "Legend" },
];

const NAV_FOR: Record<NonNullable<CurrentPlayer>, Screen[]> = {
  joe: ["landing", "joe", "liz", "shared", "itlog", "legend"],
  liz: ["landing", "joe", "liz", "shared", "legend"],
};

// ─── Shell ─────────────────────────────────────────────────────────────────────
interface ShellProps {
  screen:       Screen;
  setScreen:    (s: Screen) => void;
  dark:         boolean;
  toggleTheme:  () => void;
  topTitle:     string;
  topSub:       string;
  navIds:       Screen[];
  onSignOut:    () => void;
  children:     React.ReactNode;
}

function Shell({ screen, setScreen: handleSetScreen, dark, toggleTheme, topTitle, topSub, navIds, onSignOut, children }: ShellProps) {
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
              onClick={() => handleSetScreen(n.id)}
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

// ─── TITLES map ────────────────────────────────────────────────────────────────
const TITLES: Record<Screen, [string, string]> = {
  landing: ["Quest Board",  "Your daily command center"],
  joe:     ["Joe's Board",  "Warrior · Daily Quests"],
  liz:     ["Liz's Board",  "Mage · Daily Quests"],
  shared:  ["Shared Realm", "Feed · Stats · Leaderboard"],
  itlog:   ["IT Daily Log", "Tickets · Notes · Handoff"],
  legend:  ["XP Legend",    "Quest guide & scoring reference"],
};

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { session, loading, signIn, signOut } = useAuth();
  const [dark, setDark] = useState<boolean>(false);

  const currentPlayer: CurrentPlayer = resolvePlayer(session);

  const [screen, setScreen] = useState<Screen>("landing");
  const prevPlayer = useRef<CurrentPlayer>(null);

  // Persist screen across reloads; only redirect to board on fresh login
  useEffect(() => {
    if (!currentPlayer) { prevPlayer.current = null; return; }
    const validScreens: Screen[] = NAV_FOR[currentPlayer];
    if (prevPlayer.current === null) {
      const saved = sessionStorage.getItem("quest_screen") as Screen | null;
      setScreen(saved && validScreens.includes(saved) ? saved : currentPlayer);
    }
    prevPlayer.current = currentPlayer;
  }, [currentPlayer]);

  const handleSetScreen = (s: Screen): void => {
    setScreen(s);
    sessionStorage.setItem("quest_screen", s);
  };

  const joePlayer: UsePlayerReturn = usePlayer(JOE_QUESTS, "Joe");
  const lizPlayer: UsePlayerReturn = usePlayer(LIZ_QUESTS, "Liz");
  const feed:      UseFeedReturn   = useFeed();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = (): void => setDark(d => !d);

  const [topTitle, topSub] = TITLES[screen] ?? TITLES.landing;
  const navIds: Screen[] = currentPlayer ? NAV_FOR[currentPlayer] : [];

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
        screen={screen} setScreen={handleSetScreen}
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
            onJoe={currentPlayer === "joe" ? () => handleSetScreen("joe") : null}
            onLiz={currentPlayer === "liz" ? () => handleSetScreen("liz") : null}
            onShared={() => handleSetScreen("shared")}
            onITLog={currentPlayer === "joe" ? () => handleSetScreen("itlog") : null}
          />
        )}

        {screen === "joe" && (
          <PlayerBoard
            player="Joe" color="#6a50d0"
            avatar={WarriorAvatar}
            playerHook={joePlayer}
            readOnly={currentPlayer !== "joe"}
            onBack={() => handleSetScreen("landing")}
            onShared={() => handleSetScreen("shared")}
            onITLog={currentPlayer === "joe" ? () => handleSetScreen("itlog") : undefined}
          />
        )}

        {screen === "liz" && (
          <PlayerBoard
            player="Liz" color="#c040a0"
            avatar={MageAvatar}
            playerHook={lizPlayer}
            readOnly={currentPlayer !== "liz"}
            onBack={() => handleSetScreen("landing")}
            onShared={() => handleSetScreen("shared")}
          />
        )}

        {screen === "shared" && (
          <SharedRealm
            currentPlayer={currentPlayer}
            joeXP={joePlayer.earnedXP}      lizXP={lizPlayer.earnedXP}
            joeDone={joePlayer.doneCount}   lizDone={lizPlayer.doneCount}
            joeTotal={joePlayer.totalCount} lizTotal={lizPlayer.totalCount}
            feedHook={feed}
            onBack={() => handleSetScreen("landing")}
          />
        )}

        {screen === "itlog" && currentPlayer === "joe" && (
          <ITLog onBack={() => handleSetScreen("landing")} />
        )}

        {screen === "legend" && <Legend />}
      </Shell>
    </ThemeCtx.Provider>
  );
}
