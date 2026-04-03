import React from "react";

// ── Category card ──────────────────────────────────────────────────────────────
function CatCard({ icon, label, range, quests, headerBg, labelColor, badgeBg, badgeColor }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, overflow: "hidden",
    }}>
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
        background: headerBg,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "0.05em",
          textTransform: "uppercase", color: labelColor,
        }}>{label}</span>
        <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.6, color: labelColor }}>
          {range}
        </span>
      </div>
      <div style={{ padding: "0 4px 8px" }}>
        {quests.map(([name, xp]) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 14px", borderRadius: 8, margin: "2px 4px",
          }}
            className="legend-quest-row"
          >
            <span style={{ fontSize: 13, color: "var(--text1)", flex: 1 }}>{name}</span>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
              whiteSpace: "nowrap", marginLeft: 8,
              background: badgeBg, color: badgeColor,
            }}>{xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    icon: "🌿", label: "Daily Anchors", range: "10–20 XP",
    headerBg: "rgba(20,83,45,0.35)", labelColor: "#86efac",
    badgeBg: "rgba(20,83,45,0.6)", badgeColor: "#86efac",
    quests: [
      ["Morning routine completed", 15],
      ["Healthy meal prepared or eaten", 15],
      ["Water intake goal hit", 10],
      ["Made the bed / tidy space", 10],
      ["Wind-down / no screens by 10 PM", 10],
      ["Quest Board loaded for next day", 10],
    ],
  },
  {
    icon: "📚", label: "Learning & Growth", range: "15–35 XP",
    headerBg: "rgba(46,16,101,0.35)", labelColor: "#a78bfa",
    badgeBg: "rgba(46,16,101,0.6)", badgeColor: "#c4b5fd",
    quests: [
      ["Study session or course module done", 20],
      ["Book chapter or article read", 15],
      ["New skill practiced (any)", 20],
      ["Journal entry written", 15],
      ["Goal or plan reviewed / updated", 15],
      ["Applied something learned", 25],
    ],
  },
  {
    icon: "💪", label: "Health & Body", range: "10–30 XP",
    headerBg: "rgba(69,26,3,0.35)", labelColor: "#fcd34d",
    badgeBg: "rgba(69,26,3,0.6)", badgeColor: "#fde68a",
    quests: [
      ["Workout or exercise session", 30],
      ["Walk taken (15+ min)", 10],
      ["Stretching or mobility work", 10],
      ["8+ hours sleep logged", 15],
      ["Mental health check-in done", 15],
      ["Avoided a bad habit today", 20],
    ],
  },
  {
    icon: "🎨", label: "Creative & Personal", range: "15–35 XP",
    headerBg: "rgba(12,42,74,0.35)", labelColor: "#7dd3fc",
    badgeBg: "rgba(12,42,74,0.6)", badgeColor: "#93c5fd",
    quests: [
      ["Creative project worked on", 25],
      ["Something made or built", 30],
      ["Photo, video, or content created", 20],
      ["Hard conversation handled", 25],
      ["Something you were avoiding — done", 35],
      ["Errand or admin task cleared", 15],
    ],
  },
  {
    icon: "❤️", label: "Connection", range: "15–30 XP",
    headerBg: "rgba(80,7,36,0.35)", labelColor: "#f9a8d4",
    badgeBg: "rgba(80,7,36,0.6)", badgeColor: "#fda4af",
    quests: [
      ["Present time with Joe (no phones)", 25],
      ["Reached out to a friend or family", 15],
      ["Did something kind unprompted", 20],
      ["Supported someone through something", 25],
      ["Date night / quality time planned", 20],
      ["Gratitude expressed out loud", 15],
    ],
  },
  {
    icon: "🌙", label: "Work & Career", range: "20–50 XP",
    headerBg: "rgba(31,18,48,0.45)", labelColor: "#c084fc",
    badgeBg: "rgba(46,16,101,0.6)", badgeColor: "#c4b5fd",
    quests: [
      ["Work shift or shift prep completed", 20],
      ["Difficult work situation handled well", 30],
      ["Applied for a job or opportunity", 40],
      ["Resume or profile updated", 25],
      ["Interview completed", 50],
      ["Career goal identified + written down", 20],
    ],
  },
];

const BOSS_QUESTS = [
  ["Did something you were genuinely afraid to do", 50],
  ["Applied for a job or opportunity", 40],
  ["Interview completed", 50],
  ["Had a hard conversation with someone important", 40],
  ["Completed a full personal project or goal", 45],
];

const SHARED_QUESTS = [
  ["Date night completed (both present, no phones)", "+25 XP each"],
  ["Both complete a Boss Quest on the same day", "+15 XP each"],
  ["Workout or walk done together", "+20 XP each"],
  ["Both hit their daily quest targets", "+10 XP each"],
  ["Challenge Quest sent + completed", "+25 XP each"],
  ["Shared Realm post left for the other player", "+10 XP each"],
];

const RULES = [
  "Add quests to your board the night before using the XP legend above. You can also add quests any time during the day.",
  "XP values are suggested — adjust up or down based on how hard something actually was for you. Honesty over gamification.",
  "Boss Quests (40+ XP) show with a 👑 on the board. Flag one before your day starts so you know what the big thing is.",
  "Shared Realm quests only count if both players log them. No claiming XP for a date night Joe didn't show up for.",
  "Streaks matter more than totals. A consistent 80 XP day beats an irregular 200 XP day followed by nothing.",
  "There is no wrong way to use the board. It's yours. Shape it around what actually moves your life forward.",
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function Legend() {
  return (
    <div className="content">
      <style>{`
        .legend-quest-row:hover { background: var(--surface2); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 6 }}>👑✨</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#c084fc", letterSpacing: "0.04em" }}>
          XP Legend &amp; Gameboard Guide
        </h2>
        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>
          Liz's Mage Board &nbsp;·&nbsp; Use this to plan and score your quests
        </p>
      </div>

      {/* Category grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16, marginBottom: 16,
      }}>
        {CATEGORIES.map(cat => <CatCard key={cat.label} {...cat} />)}
      </div>

      {/* Boss Quests */}
      <div style={{
        background: "rgba(26,10,10,0.6)", border: "1px solid #7f1d1d",
        borderRadius: 14, overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
          background: "rgba(42,16,16,0.8)",
        }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#f87171" }}>
            Boss Quests — Mage Edition
          </span>
          <span style={{ fontSize: 12, marginLeft: "auto", opacity: 0.7, color: "#f87171" }}>40–50 XP</span>
        </div>
        <div style={{ padding: "12px 16px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.7 }}>
          A <strong style={{ color: "#f87171" }}>Boss Quest</strong> is any single quest worth 40+ XP or one requiring real sustained effort and courage.
          <div style={{ marginTop: 12, marginBottom: 4, fontWeight: 600, color: "#f87171" }}>👑 Mage Standing Boss Quests:</div>
          {BOSS_QUESTS.map(([name, xp]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <span>🔥 {name}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                background: "rgba(69,10,10,0.7)", color: "#fca5a5", whiteSpace: "nowrap", marginLeft: 16,
              }}>{xp} XP</span>
            </div>
          ))}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(127,29,29,0.4)" }}>
            Completing a Boss Quest on the same day Joe completes one = <strong style={{ color: "#f87171" }}>+15 XP Sync Bonus</strong> for both players.
          </div>
        </div>
      </div>

      {/* Shared Realm */}
      <div style={{
        background: "var(--surface)", border: "1px solid #164e63",
        borderRadius: 14, padding: 16, marginBottom: 16,
      }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.05em", color: "#67e8f9", marginBottom: 6,
        }}>⚡ Shared Realm — Two-Player Quests</h3>
        <p style={{ fontSize: 12, color: "#67e8f9", marginBottom: 12, opacity: 0.8 }}>
          Both players earn XP when these are completed together.
        </p>
        {SHARED_QUESTS.map(([name, xp]) => (
          <div key={name} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "7px 0", borderBottom: "1px solid rgba(22,78,99,0.4)", fontSize: 13,
          }}>
            <span style={{ color: "#a5f3fc" }}>{name}</span>
            <span style={{
              fontWeight: 700, color: "#22d3ee", fontSize: 12,
              background: "rgba(14,58,71,0.6)", padding: "2px 10px", borderRadius: 20,
              whiteSpace: "nowrap", marginLeft: 12,
            }}>{xp}</span>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 14, padding: 16, marginBottom: 8,
      }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.05em", color: "var(--text2)", marginBottom: 10,
        }}>📜 How the Board Works</h3>
        {RULES.map((rule, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "6px 0",
            borderBottom: i < RULES.length - 1 ? "1px solid var(--border)" : "none",
            fontSize: 13, color: "var(--text1)", lineHeight: 1.5,
          }}>
            <span style={{ color: "#6366f1", fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>◆</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
