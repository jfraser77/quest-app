import React, { useState, useEffect, createContext, useContext } from "react";
import { GLOBAL_CSS } from "./styles";
import { usePlayer, useFeed } from "./hooks";
import { JOE_QUESTS, LIZ_QUESTS } from "./data";
import { WarriorAvatar, MageAvatar } from "./avatars";
import Landing    from "./components/Landing";
import PlayerBoard from "./components/PlayerBoard";
import SharedRealm from "./components/SharedRealm";
import ITLog       from "./components/ITLog";

// ─── Theme context ─────────────────────────────────────────────────────────────
export const ThemeCtx = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

// ─── Sidebar nav config ────────────────────────────────────────────────────────
const NAV = [
  { id: "landing",  icon: "⚔️",  label: "Home"       },
  { id: "joe",      icon: "🛡",  label: "Joe"        },
  { id: "liz",      icon: "✨",  label: "Liz"        },
  { id: "shared",   icon: "🔮",  label: "Realm"      },
  { id: "itlog",    icon: "🖥",  label: "IT Log"     },
];

// ─── Shared layout wrapper ─────────────────────────────────────────────────────
function Shell({ screen, setScreen, dark, toggleTheme, topTitle, topSub, children }) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" });

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">Q</div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
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
  const [screen, setScreen] = useState("landing");
  const [dark,   setDark]   = useState(false);

  const joePlayer = usePlayer(JOE_QUESTS);
  const lizPlayer = usePlayer(LIZ_QUESTS);
  const feed      = useFeed();

  // Apply theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => setDark(d => !d);

  const TITLES = {
    landing: ["Quest Board",        "Your daily command center"],
    joe:     ["Joe's Board",        "Warrior · Daily Quests"],
    liz:     ["Liz's Board",        "Mage · Daily Quests"],
    shared:  ["Shared Realm",       "Feed · Stats · Leaderboard"],
    itlog:   ["IT Daily Log",       "Tickets · Notes · Handoff"],
  };

  const [topTitle, topSub] = TITLES[screen] || TITLES.landing;

  const sharedProps = {
    screen, setScreen,
    dark, toggleTheme,
    topTitle, topSub,
  };

  return (
    <ThemeCtx.Provider value={{ dark, toggle: toggleTheme }}>
      <style>{GLOBAL_CSS}</style>

      <Shell {...sharedProps}>
        {screen === "landing" && (
          <Landing
            joeXP={joePlayer.earnedXP}    lizXP={lizPlayer.earnedXP}
            joeDone={joePlayer.doneCount} lizDone={lizPlayer.doneCount}
            joeTotal={joePlayer.totalCount} lizTotal={lizPlayer.totalCount}
            onJoe={()    => setScreen("joe")}
            onLiz={()    => setScreen("liz")}
            onShared={()  => setScreen("shared")}
            onITLog={()   => setScreen("itlog")}
          />
        )}

        {screen === "joe" && (
          <PlayerBoard
            player="Joe" color="#6a50d0"
            avatar={WarriorAvatar}
            playerHook={joePlayer}
            onBack={()    => setScreen("landing")}
            onShared={()  => setScreen("shared")}
            onITLog={()   => setScreen("itlog")}
          />
        )}

        {screen === "liz" && (
          <PlayerBoard
            player="Liz" color="#c040a0"
            avatar={MageAvatar}
            playerHook={lizPlayer}
            onBack={()    => setScreen("landing")}
            onShared={()  => setScreen("shared")}
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

        {screen === "itlog" && (
          <ITLog onBack={() => setScreen("landing")} />
        )}
      </Shell>
    </ThemeCtx.Provider>
  );
}
