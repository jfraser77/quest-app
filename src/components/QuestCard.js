import React from "react";
import { TYPE_COLOR, QUEST_TYPES } from "../data";

// ── PLAY card ─────────────────────────────────────────────────────────────────
export function QuestCard({ quest, isDone, isFlash, onToggle, accentColor }) {
  const tc = TYPE_COLOR[quest.type] || "#6a50d0";

  return (
    <div
      className={`q-card${isDone ? " done" : ""}${isFlash ? " flash" : ""}`}
      onClick={() => onToggle(quest.id)}
    >
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        {/* Checkbox */}
        <div
          style={{
            width:22, height:22, borderRadius:7, flexShrink:0, marginTop:2,
            border: isDone ? "none" : `2px solid ${tc}`,
            background: isDone ? tc : "transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}
        >
          {isDone && <span style={{ color:"#fff", fontSize:12, fontWeight:700, lineHeight:1 }}>✓</span>}
        </div>

        {/* Body */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
            <span style={{
              fontFamily:"'Urbanist',sans-serif", fontSize:14, fontWeight:700,
              color: isDone ? "var(--text3)" : "var(--text1)",
              textDecoration: isDone ? "line-through" : "none",
            }}>
              {quest.title}
            </span>
            {quest.boss && (
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#fff0dc", color:"#a06010", fontWeight:700 }}>
                BOSS
              </span>
            )}
            <span style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:tc, whiteSpace:"nowrap" }}>
              +{quest.xp} XP
            </span>
          </div>

          {quest.desc && (
            <div style={{ fontSize:12, color:"var(--text2)", marginTop:4, lineHeight:1.6 }}>
              {quest.desc}
            </div>
          )}

          <div style={{ display:"flex", gap:6, marginTop:7, flexWrap:"wrap", alignItems:"center" }}>
            {quest.time && (
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:6, background:"var(--surface2)", color:"var(--text2)", border:"1px solid var(--border)" }}>
                {quest.time}
              </span>
            )}
            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:6, background: tc+"18", color:tc, fontWeight:700, letterSpacing:"0.04em" }}>
              {quest.type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EDIT card ─────────────────────────────────────────────────────────────────
export function QuestEditor({ quest, sectionId, onUpdate, onRemove }) {
  const upd = (f, v) => onUpdate(sectionId, quest.id, f, v);

  return (
    <div className="q-card" style={{ cursor:"default", marginBottom:10 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:8 }}>
          <input value={quest.title}  onChange={e=>upd("title",  e.target.value)} placeholder="Quest title..."/>
          <input value={quest.desc}   onChange={e=>upd("desc",   e.target.value)} placeholder="Description (optional)..."/>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input value={quest.time} onChange={e=>upd("time", e.target.value)} placeholder="Time window..." style={{ flex:"1 1 120px" }}/>
            <select value={quest.type} onChange={e=>upd("type", e.target.value)} style={{ flex:"1 1 100px" }}>
              {QUEST_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" value={quest.xp} onChange={e=>upd("xp",Number(e.target.value))}
              min={5} max={200} step={5} style={{ width:70, flex:"0 0 70px" }}/>
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", fontSize:12, color:"var(--text2)", fontWeight:500 }}>
            <input type="checkbox" checked={quest.boss} onChange={e=>upd("boss",e.target.checked)} style={{ width:"auto", cursor:"pointer" }}/>
            Mark as Boss quest
          </label>
        </div>
        <button className="btn btn-danger btn-sm" style={{ padding:"6px 10px", fontSize:16, flexShrink:0 }}
          onClick={()=>onRemove(sectionId, quest.id)}>✕</button>
      </div>
    </div>
  );
}
