import React from "react";
import { WarriorAvatar, MageAvatar } from "../avatars";
import { DAYS_SHORT } from "../data";
import { T } from "../styles";

const todayIdx = new Date().getDay();

// ── Mini bar chart data (mock weekly trend) ────────────────────────────────────
const BAR_SETS = {
  joe: [40, 65, 30, 80, 55, 90, 70],
  liz: [50, 40, 70, 60, 45, 85, 65],
  xp:  [30, 70, 50, 90, 40, 75, 80],
};

function MiniBarChart({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mini-bars">
      {data.map((v, i) => (
        <div
          key={i}
          className="mini-bar"
          style={{
            height: `${Math.round((v / max) * 100)}%`,
            background: i === todayIdx ? color : color + "66",
            borderRadius: i === todayIdx ? "4px 4px 2px 2px" : "3px 3px 2px 2px",
          }}
        />
      ))}
    </div>
  );
}

// ── Platform insight row ───────────────────────────────────────────────────────
function InsightRow({ icon, name, pct, color }) {
  return (
    <div className="rp-item">
      <div className="rp-icon">{icon}</div>
      <div className="rp-label">
        <div className="rp-name">{name}</div>
        <div className="rp-bar-wrap">
          <div className="rp-bar" style={{ width: pct + "%", background: color }} />
        </div>
      </div>
      <div className="rp-val">{pct}%</div>
    </div>
  );
}

// ── Player card in right panel ─────────────────────────────────────────────────
function PlayerRow({ name, role, done, total, xp, color, Avatar, badge, onClick }) {
  return (
    <div className="rp-item" style={{ cursor: "pointer" }} onClick={onClick}>
      <Avatar size={34} />
      <div className="rp-label">
        <div className="rp-name">{name}</div>
        <span className={`badge-tag ${badge}`}>{role}</span>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color }}>{xp} XP</div>
        <div style={{ fontSize: 10, color: "var(--text2)" }}>{done}/{total}</div>
      </div>
    </div>
  );
}

// ── Quest pipeline rows ────────────────────────────────────────────────────────
const PIPELINE = [
  { label: "Work / IT",      chips: [3, 2, null, null, null], colors: ["pc-a","pc-b"] },
  { label: "Growth",         chips: [4, 3, 2, null, null],    colors: ["pc-b","pc-b","pc-b"] },
  { label: "Relationship",   chips: [2, 2, 1, 1, null],       colors: ["pc-c","pc-c","pc-c","pc-c"] },
  { label: "Body / Health",  chips: [2, null, null, null, null], colors: ["pc-d"] },
  { label: "Personal",       chips: [3, 2, 1, null, null],    colors: ["pc-e","pc-e","pc-e"] },
];

const PIPE_COLS = ["Today", "Active", "Done", "Boss", "Streak"];

export default function Landing({
  joeXP, lizXP, joeDone, lizDone, joeTotal, lizTotal,
  currentPlayer, onJoe, onLiz, onShared, onITLog,
}) {
  const totalXP    = joeXP + lizXP;
  const totalDone  = joeDone + lizDone;
  const totalQ     = joeTotal + lizTotal;
  const joePct     = joeTotal > 0 ? Math.round((joeDone / joeTotal) * 100) : 0;
  const lizPct     = lizTotal > 0 ? Math.round((lizDone / lizTotal) * 100) : 0;

  return (
    <div className="content">
      <div className="content-grid">

        {/* ── LEFT / MAIN ── */}
        <div className="content-main">

          {/* STAT CARDS */}
          <div className="stat-cards-row">
            {/* Joe */}
            <div className="stat-card stat-card-a">
              <div className="stat-label">Joe's Progress</div>
              <div className="stat-value">+{joeXP}</div>
              <div className="stat-row">
                <span className="pill pill-up">↑ {joePct}%</span>
                <span className="stat-vs">quests done</span>
              </div>
              <MiniBarChart data={BAR_SETS.joe} color="#6a50d0" />
            </div>

            {/* Liz */}
            <div className="stat-card stat-card-b">
              <div className="stat-label">Liz's Progress</div>
              <div className="stat-value">+{lizXP}</div>
              <div className="stat-row">
                <span className="pill pill-up">↑ {lizPct}%</span>
                <span className="stat-vs">quests done</span>
              </div>
              <MiniBarChart data={BAR_SETS.liz} color="#c040a0" />
            </div>

            {/* Combined */}
            <div className="stat-card stat-card-c">
              <div className="stat-label">Total Bond XP</div>
              <div className="stat-value">+{totalXP}</div>
              <div className="stat-row">
                <span className="pill pill-up">↑ {totalDone}/{totalQ}</span>
                <span className="stat-vs">combined today</span>
              </div>
              <MiniBarChart data={BAR_SETS.xp} color="#c080e0" />
            </div>
          </div>

          {/* QUEST PIPELINE TABLE */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Quest Pipeline</div>
              <button className="panel-more">···</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="pipe-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    {PIPE_COLS.map(c => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PIPELINE.map((row, ri) => (
                    <tr key={ri}>
                      <td>{row.label}</td>
                      {row.chips.map((val, ci) => (
                        <td key={ci}>
                          {val !== null
                            ? <span className={`pipe-chip ${row.colors[ci] || "pc-a"}`}>{val}</span>
                            : <span style={{ color: "var(--text3)", fontSize: 12 }}>—</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUICK NAV CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {onJoe && (
              <button className="enter-card" onClick={onJoe}>
                <WarriorAvatar size={44} />
                <div>
                  <div className="enter-card-title" style={{ color: "#6a50d0" }}>Joe's Board</div>
                  <div className="enter-card-sub">{joeDone}/{joeTotal} quests · {joeXP} XP</div>
                </div>
              </button>
            )}
            {onLiz && (
              <button className="enter-card" onClick={onLiz}>
                <MageAvatar size={44} />
                <div>
                  <div className="enter-card-title" style={{ color: "#c040a0" }}>Liz's Board</div>
                  <div className="enter-card-sub">{lizDone}/{lizTotal} quests · {lizXP} XP</div>
                </div>
              </button>
            )}
            <button className="enter-card" onClick={onShared}>
              <span style={{ fontSize: 36 }}>🔮</span>
              <div>
                <div className="enter-card-title">Shared Realm</div>
                <div className="enter-card-sub">Feed · Stats · Leaderboard</div>
              </div>
            </button>
            {onITLog && (
              <button className="enter-card" onClick={onITLog}>
                <span style={{ fontSize: 36 }}>🖥</span>
                <div>
                  <div className="enter-card-title">IT Daily Log</div>
                  <div className="enter-card-sub">Tickets · Notes · Handoff</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="content-right">

          {/* LEADERBOARD */}
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-header">
              <div className="panel-title">Leaderboard</div>
              <button className="panel-more">···</button>
            </div>
            {[
              { name:"Joe", role:"Warrior", done:joeDone, total:joeTotal, xp:joeXP, color:"#6a50d0", A:WarriorAvatar, badge:"badge-w", onClick:onJoe },
              { name:"Liz", role:"Mage",    done:lizDone, total:lizTotal, xp:lizXP, color:"#c040a0", A:MageAvatar,    badge:"badge-m", onClick:onLiz },
            ].sort((a,b)=>b.xp-a.xp).map((p,i)=>(
              <div key={p.name} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 0", borderBottom: i===0?"1px solid var(--border)":"none" }}>
                <span style={{ fontSize:16, width:20 }}>{i===0?"🥇":"🥈"}</span>
                <p.A size={34}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--text1)" }}>{p.name}</div>
                  <span className={`badge-tag ${p.badge}`}>{p.role}</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:15, fontWeight:800, color:p.color }}>{p.xp}</div>
                  <div style={{ fontSize:10, color:"var(--text2)" }}>XP</div>
                </div>
              </div>
            ))}
          </div>

          {/* WEEKLY STREAK */}
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-header">
              <div className="panel-title">Week Streak</div>
            </div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {DAYS_SHORT.map((d,i)=>(
                <div key={d} className={`day-pip${i===todayIdx?" today":i<todayIdx?" past":""}`}>{d}</div>
              ))}
            </div>
            <div style={{ fontSize:12, color:"var(--text2)", marginTop:10, lineHeight:1.6 }}>
              {todayIdx + 1} days into the week · Keep it going 🔥
            </div>
          </div>

          {/* PLATFORM INSIGHT (quest type breakdown) */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Quest Insight</div>
              <button className="panel-more">···</button>
            </div>
            <InsightRow icon="⚔️" name="Work / IT"    pct={32} color="#6a50d0"/>
            <InsightRow icon="📈" name="Growth"        pct={28} color="#4a90d0"/>
            <InsightRow icon="❤️" name="Relationship"  pct={22} color="#c040a0"/>
            <InsightRow icon="💪" name="Body"          pct={12} color="#40a080"/>
            <InsightRow icon="🏠" name="Home / Self"   pct={6}  color="#d09040"/>
          </div>
        </div>

      </div>
    </div>
  );
}
