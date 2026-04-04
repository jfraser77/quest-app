import React, { useState } from "react";
import { SECTIONS, DAYS_SHORT } from "../data";
import { QuestCard, QuestEditor } from "./QuestCard";


const todayIdx = new Date().getDay();

export default function PlayerBoard({ player, color, avatar: Avatar, playerHook, onBack, onShared, onITLog }) {
  const [mode,       setMode]       = useState("play");
  const [questTab,   setQuestTab]   = useState("today");
  const [flash,      setFlash]      = useState(null);
  const [intention,  setIntention]  = useState("");
  const [dailyNote,  setDailyNote]  = useState("");
  const [selDay,     setSelDay]     = useState(todayIdx);

  const {
    quests, done, addQuest, updateQuest, removeQuest,
    toggleDone, loadDay, resetDay,
    totalXP, earnedXP, totalCount, doneCount, pct,
  } = playerHook;

  const handleToggle = (id) => {
    toggleDone(id);
    setFlash(id);
    setTimeout(() => setFlash(null), 600);
  };

  const handleLoadDay = (i) => { setSelDay(i); loadDay(i); };

  const allFlat = Object.values(quests).flat().filter(q => q.title.trim());

  const isWarrior = player === "Joe";
  const badgeCls  = isWarrior ? "badge-w" : "badge-m";
  const roleLabel = isWarrior ? "Warrior" : "Mage";

  return (
    <div className="content">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>

        {/* ── LEFT: HERO + QUESTS ── */}
        <div>
          {/* HERO CARD */}
          <div className="panel" style={{ marginBottom:20, display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ background:"var(--surface2)", borderRadius:16, padding:"10px 14px", border:"1px solid var(--border)" }}>
              <Avatar size={72}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Urbanist',sans-serif", fontSize:22, fontWeight:800, color }}>
                  {player}
                </span>
                <span className={`badge-tag ${badgeCls}`}>{roleLabel}</span>
              </div>
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:3 }}>
                {DAYS_SHORT[todayIdx]} · {doneCount}/{totalCount} quests done
              </div>

              {/* XP bar */}
              <div style={{ marginTop:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:"var(--text2)" }}>Progress</span>
                  <span style={{ fontSize:11, fontWeight:700, color }}>{earnedXP} / {totalXP} XP</span>
                </div>
                <div style={{ background:"var(--border)", borderRadius:6, height:8, overflow:"hidden" }}>
                  <div className="xp-fill" style={{ width:pct+"%", height:"100%", background:color, borderRadius:6 }}/>
                </div>
              </div>

              {/* Week streak */}
              <div style={{ display:"flex", gap:4, marginTop:12, flexWrap:"wrap" }}>
                {DAYS_SHORT.map((d,i) => (
                  <div key={d} className={`day-pip${i===todayIdx?" today":i<todayIdx?" past":""}`}>{d}</div>
                ))}
              </div>
            </div>
          </div>

          {/* MODE + TABS */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <div className="tabs" style={{ flex:1 }}>
              <button className={`tab-btn${questTab==="today"?" active":""}`} onClick={()=>setQuestTab("today")}>Today</button>
              <button className={`tab-btn${questTab==="all"?" active":""}`}   onClick={()=>setQuestTab("all")}>All Days</button>
            </div>
            <button className={`btn btn-sm${mode==="play"?" btn-primary":""}`} onClick={()=>setMode("play")}>▶ Play</button>
            <button className={`btn btn-sm${mode==="edit"?" btn-primary":""}`} onClick={()=>setMode("edit")}>✏ Edit</button>
            <button className="btn btn-sm" onClick={resetDay} style={{ color:"var(--text3)" }}>↺</button>
          </div>

          {/* EDIT MODE */}
          {mode==="edit" && (
            <div className="reveal">
              <div className="panel" style={{ marginBottom:14 }}>
                <div className="section-label" style={{ marginBottom:10 }}>LOAD DAY PRESET</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {DAYS_SHORT.map((d,i)=>(
                    <button key={d} className={`day-pip${selDay===i?" today":""}`}
                      onClick={()=>handleLoadDay(i)}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="panel" style={{ marginBottom:14 }}>
                <div className="section-label" style={{ marginBottom:8 }}>DAILY INTENTION</div>
                <textarea value={intention} onChange={e=>setIntention(e.target.value)}
                  placeholder="What's the one thing that would make today a win?" rows={2} style={{ resize:"none" }}/>
              </div>

              {SECTIONS.map(s => (
                <div key={s.id}>
                  <div className="section-divider">— {s.label.toUpperCase()} —</div>
                  {(quests[s.id]||[]).map(q=>(
                    <QuestEditor key={q.id} quest={q} sectionId={s.id} onUpdate={updateQuest} onRemove={removeQuest}/>
                  ))}
                  <button className="btn btn-dashed" onClick={()=>addQuest(s.id)}>+ Add to {s.label}</button>
                </div>
              ))}

              <div className="panel" style={{ marginTop:16 }}>
                <div className="section-label" style={{ marginBottom:8 }}>CLOSING NOTE</div>
                <textarea value={dailyNote} onChange={e=>setDailyNote(e.target.value)}
                  placeholder="A reminder or reason to finish strong..." rows={2} style={{ resize:"none" }}/>
              </div>

              <button className="btn btn-primary btn-full" style={{ marginTop:14, padding:12 }}
                onClick={()=>setMode("play")}>▶ Start Quest Day</button>
            </div>
          )}

          {/* PLAY MODE */}
          {mode==="play" && (
            <div className="reveal">
              {intention && (
                <div className="panel" style={{ marginBottom:14, borderLeft:`3px solid ${color}` }}>
                  <div className="section-label" style={{ marginBottom:4 }}>TODAY'S INTENTION</div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, fontStyle:"italic" }}>
                    "{intention}"
                  </div>
                </div>
              )}

              {questTab==="today" ? (
                SECTIONS.map(s=>{
                  const sq=(quests[s.id]||[]).filter(q=>q.title.trim());
                  if(!sq.length) return null;
                  return (
                    <div key={s.id}>
                      <div className="section-divider">— {s.label.toUpperCase()} —</div>
                      {sq.map(q=>(
                        <QuestCard key={q.id} quest={q}
                          isDone={!!done[q.id]} isFlash={flash===q.id}
                          onToggle={handleToggle} accentColor={color}/>
                      ))}
                    </div>
                  );
                })
              ) : (
                allFlat.map(q=>(
                  <QuestCard key={q.id} quest={q}
                    isDone={!!done[q.id]} isFlash={flash===q.id}
                    onToggle={handleToggle} accentColor={color}/>
                ))
              )}

              {dailyNote && (
                <div className="panel" style={{ marginTop:14, borderLeft:`3px solid ${color}` }}>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7, fontStyle:"italic" }}>
                    "{dailyNote}"
                  </div>
                </div>
              )}

              {doneCount===totalCount && totalCount>0 && (
                <div className="reveal panel" style={{ marginTop:20, textAlign:"center", background:"var(--card-d)", border:"1px solid #90e8b0" }}>
                  <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:16, fontWeight:800, color:"#18905a" }}>
                    ALL QUESTS COMPLETE 🏆
                  </div>
                  <div style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>{totalXP} XP earned · Rest earned.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>
          {/* STAT CARDS */}
          <div className="stat-card stat-card-a" style={{ marginBottom:14, borderRadius:18 }}>
            <div className="stat-label">XP Earned Today</div>
            <div className="stat-value" style={{ color }}>{earnedXP}</div>
            <div className="stat-row">
              <span className="pill pill-up">↑ {pct}%</span>
              <span className="stat-vs">of daily goal</span>
            </div>
          </div>

          <div className="stat-card stat-card-b" style={{ marginBottom:14, borderRadius:18 }}>
            <div className="stat-label">Quests Done</div>
            <div className="stat-value">{doneCount}<span style={{ fontSize:16, color:"var(--text2)", fontWeight:400 }}>/{totalCount}</span></div>
            <div className="stat-row">
              <span className="stat-vs">{totalCount - doneCount} remaining</span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="panel">
            <div className="section-label" style={{ marginBottom:10 }}>QUICK LINKS</div>
            <button className="enter-card" style={{ marginBottom:8, padding:"12px 14px" }} onClick={onShared}>
              <span style={{ fontSize:24 }}>🔮</span>
              <div><div className="enter-card-title">Shared Realm</div></div>
            </button>
            {isWarrior && (
              <button className="enter-card" style={{ padding:"12px 14px" }} onClick={onITLog}>
                <span style={{ fontSize:24 }}>🖥</span>
                <div><div className="enter-card-title">IT Log</div></div>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
