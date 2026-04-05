import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
// Design tokens come from CSS vars injected via GLOBAL_CSS

// ─── SEED DATA from Notion paste ─────────────────────────────────────────────

const SEED_LOGS = [
  {
    id: "d-1",
    date: "2026-03-12",
    tickets: [
      {
        id: "t-1",
        number: "36652",
        title: "Sync folder issue",
        user: "ASC OCALA",
        status: "in-progress",
        notes: "Sync tool has been restarted, will be backlogged for some time — review.",
      },
      {
        id: "t-2",
        number: "36667",
        title: "OKTA Application",
        user: "Renee T",
        status: "resolved",
        notes: "Able to login to login.etenet.com — Settings accessible from there.",
      },
    ],
    summary: "",
    handoff: "",
  },
  {
    id: "d-2",
    date: "2026-03-11",
    tickets: [
      {
        id: "t-3",
        number: "36618",
        title: "Adobe — PDFs not opening",
        user: "Amanda Evans",
        status: "resolved",
        notes: "When you see the transparent circle, just hover and expand.",
      },
    ],
    summary: "",
    handoff: "",
  },
  {
    id: "d-3",
    date: "2026-03-06",
    tickets: [
      {
        id: "t-4",
        number: "36299",
        title: "Phone not working",
        user: "",
        status: "resolved",
        notes: "Adjusted sound input.",
      },
      {
        id: "t-5",
        number: "36300",
        title: "Connect tunnel — VPN",
        user: "April Godoy",
        status: "resolved",
        notes: "Unlocked AD.",
      },
    ],
    summary: "",
    handoff: "Handoff Document — Context Amnesia",
  },
  {
    id: "d-4",
    date: "2026-03-02",
    tickets: [
      {
        id: "t-6",
        number: "35922",
        title: "Install Software HST PAS",
        user: "Maddie O",
        status: "resolved",
        notes: "Installed.",
      },
      {
        id: "t-7",
        number: "36410",
        title: "Scanner not working",
        user: "",
        status: "resolved",
        notes:
          "Disconnect ethernet from printer and reconnect. If on WiFi, restart router. If neither works: right-click printer → Hide Printer → re-add and check if scanner comes back after reconnect.",
      },
    ],
    summary: "",
    handoff: "",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const newId   = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
const today   = () => new Date().toISOString().split("T")[0];
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y.slice(2)}`;
};

const STATUS_META = {
  open:        { label: "Open",        color: "#c4954a", bg: "#c4954a18" },
  "in-progress": { label: "In Progress", color: "#5a7fd4", bg: "#5a7fd418" },
  resolved:    { label: "Resolved",    color: "#4aaa7a", bg: "#4aaa7a18" },
  escalated:   { label: "Escalated",   color: "#d45a7a", bg: "#d45a7a18" },
};

const BLANK_TICKET = () => ({
  id: newId(), number: "", title: "", user: "", status: "open", notes: "",
});

// ─── TICKET ROW (view) ────────────────────────────────────────────────────────

function TicketRow({ ticket, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const sm = STATUS_META[ticket.status] || STATUS_META.open;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 9,
        marginBottom: 7,
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 13px", cursor: "pointer" }}
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Status dot */}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: sm.color, flexShrink: 0, marginTop: 5 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 12, color: "#6a50d0", fontWeight: 700 }}>
              #{ticket.number || "—"}
            </span>
            <span style={{ fontSize: 13, color: "var(--text1)", fontWeight: 500 }}>{ticket.title || "Untitled"}</span>
            {ticket.user && (
              <span style={{ fontSize: 10, color: "var(--text2)" }}>· {ticket.user}</span>
            )}
          </div>
          {!expanded && ticket.notes && (
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ticket.notes}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: sm.bg, color: sm.color, border: `1px solid ${sm.color}44` }}>
            {sm.label}
          </span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded notes */}
      {expanded && (
        <div style={{ padding: "0 13px 12px 31px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7, marginTop: 10, whiteSpace: "pre-wrap" }}>
            {ticket.notes || "No notes."}
          </div>
          <button
            className="btn"
            style={{ marginTop: 10, fontSize: 11, padding: "5px 12px" }}
            onClick={(e) => { e.stopPropagation(); onEdit(ticket); }}
          >
            ✏ Edit
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TICKET EDITOR (modal-style inline form) ──────────────────────────────────

function TicketEditor({ ticket, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState({ ...ticket });
  const upd = (f, v) => setDraft((p) => ({ ...p, [f]: v }));

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px", marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "var(--text2)", letterSpacing: "0.1em", marginBottom: 12 }}>
        {ticket.id.startsWith("new") ? "NEW TICKET" : "EDIT TICKET"}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <input
          value={draft.number}
          onChange={(e) => upd("number", e.target.value)}
          placeholder="Ticket #"
          style={{ flex: "0 0 100px" }}
        />
        <select value={draft.status} onChange={(e) => upd("status", e.target.value)} style={{ flex: "0 0 130px" }}>
          {Object.entries(STATUS_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>
      <input
        value={draft.title}
        onChange={(e) => upd("title", e.target.value)}
        placeholder="Issue title..."
        style={{ marginBottom: 8 }}
      />
      <input
        value={draft.user}
        onChange={(e) => upd("user", e.target.value)}
        placeholder="User / location (optional)..."
        style={{ marginBottom: 8 }}
      />
      <textarea
        value={draft.notes}
        onChange={(e) => upd("notes", e.target.value)}
        placeholder="Notes, steps taken, resolution..."
        rows={3}
        style={{ resize: "vertical", marginBottom: 10 }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => onSave(draft)}>Save</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
        {!ticket.id.startsWith("new") && (
          <button className="btn btn-danger" style={{ marginLeft: "auto" }} onClick={() => onDelete(ticket.id)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DAY BLOCK ────────────────────────────────────────────────────────────────

function DayBlock({ day, onUpdate, onDelete, isToday }) {
  const [editingTicket, setEditingTicket] = useState(null); // ticket id or "new"
  const [showSummary, setShowSummary] = useState(isToday);
  const [collapsed, setCollapsed] = useState(!isToday);

  const resolved = day.tickets.filter((t) => t.status === "resolved").length;
  const total    = day.tickets.length;

  const saveTicket = (draft) => {
    let tickets;
    if (editingTicket === "new") {
      tickets = [...day.tickets, { ...draft, id: newId() }];
    } else {
      tickets = day.tickets.map((t) => (t.id === draft.id ? draft : t));
    }
    onUpdate({ ...day, tickets });
    setEditingTicket(null);
  };

  const deleteTicket = (ticketId) => {
    onUpdate({ ...day, tickets: day.tickets.filter((t) => t.id !== ticketId) });
    setEditingTicket(null);
  };

  const startNew = () => {
    setEditingTicket("new");
    setCollapsed(false);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Date header */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}
        onClick={() => setCollapsed((c) => !c)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ fontFamily: "'Urbanist', sans-serif", fontSize: 13, fontWeight: 700, color: isToday ? "#8040c0" : "var(--text2)" }}>
            {isToday && "★ "}{fmtDate(day.date)}
          </span>
          {isToday && (
            <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 4, background: "#eae6ff", color: "#6a50d0", border: "1px solid #c0b0f0" }}>
              TODAY
            </span>
          )}
          <span style={{ fontSize: 10, color: "var(--text3)" }}>
            {resolved}/{total} resolved
          </span>
        </div>
        <span style={{ fontSize: 10, color: "var(--text3)" }}>{collapsed ? "▼" : "▲"}</span>
        <button
          className="btn btn-danger"
          style={{ fontSize: 10, padding: "3px 8px" }}
          onClick={(e) => { e.stopPropagation(); onDelete(day.id); }}
        >
          ✕ Day
        </button>
      </div>

      {!collapsed && (
        <div className="reveal">
          {/* Tickets */}
          {day.tickets.map((t) =>
            editingTicket === t.id ? (
              <TicketEditor
                key={t.id}
                ticket={t}
                onSave={saveTicket}
                onCancel={() => setEditingTicket(null)}
                onDelete={deleteTicket}
              />
            ) : (
              <TicketRow key={t.id} ticket={t} onEdit={(t) => setEditingTicket(t.id)} />
            )
          )}

          {/* New ticket form */}
          {editingTicket === "new" && (
            <TicketEditor
              ticket={{ ...BLANK_TICKET(), id: "new-tmp" }}
              onSave={saveTicket}
              onCancel={() => setEditingTicket(null)}
              onDelete={() => {}}
            />
          )}

          {/* Add ticket button */}
          {editingTicket !== "new" && (
            <button className="btn btn-dashed" onClick={startNew}>
              + Add ticket
            </button>
          )}

          {/* Summary / handoff */}
          <div style={{ marginTop: 12 }}>
            <button
              className="btn"
              style={{ fontSize: 11, marginBottom: 8 }}
              onClick={() => setShowSummary((s) => !s)}
            >
              {showSummary ? "▲ Hide" : "▼ Show"} Day Summary & Handoff
            </button>

            {showSummary && (
              <div className="reveal">
                <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 6 }}>
                  DAY SUMMARY
                </div>
                <textarea
                  value={day.summary}
                  onChange={(e) => onUpdate({ ...day, summary: e.target.value })}
                  placeholder="What got done, what didn't, any patterns noticed..."
                  rows={3}
                  style={{ resize: "vertical", marginBottom: 10 }}
                />
                <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginBottom: 6 }}>
                  HANDOFF NOTES
                </div>
                <textarea
                  value={day.handoff}
                  onChange={(e) => onUpdate({ ...day, handoff: e.target.value })}
                  placeholder="Context for tomorrow / next person — what's in flight, what needs follow-up..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN IT LOG SCREEN ───────────────────────────────────────────────────────

const LS_KEY = "itlog_joe";

export default function ITLog({ onBack }) {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {}
    return SEED_LOGS;
  });
  const [view, setView]  = useState("log");
  const [search, setSearch] = useState("");
  const supabaseLoaded = useRef(false);
  const saveTimer = useRef(null);

  const todayStr = today();

  // ── Load from Supabase on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("it_logs")
      .select("logs")
      .eq("player", "Joe")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("[QuestApp] it_logs load error:", error);
        supabaseLoaded.current = true;
        if (data?.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          setLogs(data.logs);
          try { localStorage.setItem(LS_KEY, JSON.stringify(data.logs)); } catch {}
        }
      });
  }, []);

  // ── Save to localStorage immediately, Supabase debounced ───────────────────
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(logs)); } catch {}
    if (!supabase || !supabaseLoaded.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from("it_logs")
        .upsert({ player: "Joe", logs }, { onConflict: "player" })
        .then(({ error }) => { if (error) console.error("[QuestApp] it_logs save error:", error); });
    }, 1500);
  }, [logs]);

  const updateDay  = (updated) => setLogs((p) => p.map((d) => (d.id === updated.id ? updated : d)));
  const deleteDay  = (id) => setLogs((p) => p.filter((d) => d.id !== id));

  const addToday = () => {
    if (logs.find((d) => d.date === todayStr)) return;
    setLogs((p) => [{ id: newId(), date: todayStr, tickets: [], summary: "", handoff: "" }, ...p]);
  };

  // Search filter across ticket numbers, titles, users, notes
  const filtered = logs.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.date.includes(q) ||
      d.tickets.some(
        (t) =>
          t.number.includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.user.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
      ) ||
      d.summary.toLowerCase().includes(q) ||
      d.handoff.toLowerCase().includes(q)
    );
  });

  // Summary stats
  const allTickets  = logs.flatMap((d) => d.tickets);
  const totalT      = allTickets.length;
  const resolvedT   = allTickets.filter((t) => t.status === "resolved").length;
  const openT       = allTickets.filter((t) => t.status === "open").length;
  const inProgT     = allTickets.filter((t) => t.status === "in-progress").length;
  const todayLog    = logs.find((d) => d.date === todayStr);
  const todayT      = todayLog ? todayLog.tickets.length : 0;
  const todayResolved = todayLog ? todayLog.tickets.filter((t) => t.status === "resolved").length : 0;

  return (
    <div className="content">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>

        {/* ── LEFT: LOG + SUMMARY ── */}
        <div>
          {/* STAT CARDS ROW */}
          <div className="stat-cards-row" style={{ gridTemplateColumns:"repeat(4,1fr)", marginBottom:20 }}>
            {[
              { l:"Today",    v:`${todayResolved}/${todayT}`, color:"#8040c0", card:"stat-card-a" },
              { l:"Open",     v:openT,    color:"#c04040", card:"stat-card-c" },
              { l:"In Prog",  v:inProgT,  color:"#4060c0", card:"stat-card-b" },
              { l:"Resolved", v:resolvedT, color:"#207050", card:"stat-card-d" },
            ].map((s) => (
              <div key={s.l} className={`stat-card ${s.card}`} style={{ minHeight:90, padding:"14px 16px" }}>
                <div className="stat-label">{s.l}</div>
                <div className="stat-value" style={{ fontSize:24, color:s.color }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="tabs" style={{ marginBottom:16 }}>
            <button className={`tab-btn${view==="log"?" active":""}`}     onClick={()=>setView("log")}>Daily Log</button>
            <button className={`tab-btn${view==="summary"?" active":""}`} onClick={()=>setView("summary")}>Summary</button>
          </div>

          {/* DAILY LOG VIEW */}
          {view==="log" && (
            <>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="🔍  Search tickets, users, notes..." style={{ marginBottom:12 }}/>

              {!todayLog ? (
                <button className="btn btn-primary btn-full" style={{ marginBottom:14 }} onClick={addToday}>
                  + Start today's log — {fmtDate(todayStr)}
                </button>
              ) : (
                <div style={{ fontSize:12, color:"var(--pill-up)", background:"var(--pill-up-bg)", border:"1px solid var(--pill-up)", borderRadius:10, padding:"8px 14px", marginBottom:12, textAlign:"center", fontWeight:600 }}>
                  ✓ Today's log is active
                </div>
              )}

              {filtered.length===0 && (
                <div style={{ textAlign:"center", fontSize:13, color:"var(--text3)", padding:"32px 0" }}>
                  {search ? `No results for "${search}"` : "No logs yet."}
                </div>
              )}

              {filtered.map(day=>(
                <DayBlock key={day.id} day={day} onUpdate={updateDay} onDelete={deleteDay} isToday={day.date===todayStr}/>
              ))}
            </>
          )}

          {/* SUMMARY VIEW */}
          {view==="summary" && (
            <div className="reveal">
              {/* Status bars */}
              <div className="panel" style={{ marginBottom:16 }}>
                <div className="panel-header"><div className="panel-title">Tickets by Status</div></div>
                {Object.entries(STATUS_META).map(([k,v])=>{
                  const count=allTickets.filter(t=>t.status===k).length;
                  const pct=totalT>0?Math.round((count/totalT)*100):0;
                  return (
                    <div key={k} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:v.color }}>{v.label}</span>
                        <span style={{ fontSize:12, color:"var(--text2)" }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ background:"var(--border)", borderRadius:4, height:6, overflow:"hidden" }}>
                        <div className="xp-fill" style={{ width:pct+"%", height:"100%", background:v.color, borderRadius:4 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent resolutions */}
              <div className="section-label" style={{ marginBottom:10 }}>RECENT RESOLUTIONS</div>
              {allTickets.filter(t=>t.status==="resolved"&&t.notes).slice(0,8).map(t=>(
                <div key={t.id} className="it-ticket">
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"var(--pill-up)" }}>#{t.number}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"var(--text1)" }}>{t.title}</span>
                    {t.user&&<span style={{ fontSize:11, color:"var(--text2)", marginLeft:"auto" }}>{t.user}</span>}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6 }}>{t.notes}</div>
                </div>
              ))}

              {/* Open items */}
              {allTickets.filter(t=>t.status!=="resolved").length>0&&(
                <>
                  <div className="section-label" style={{ margin:"18px 0 10px" }}>OPEN / IN PROGRESS</div>
                  {allTickets.filter(t=>t.status!=="resolved").map(t=>{
                    const sm=STATUS_META[t.status];
                    return (
                      <div key={t.id} className="it-ticket" style={{ borderLeft:`3px solid ${sm.color}` }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:sm.color, flexShrink:0 }}/>
                          <span style={{ fontSize:12, fontWeight:700, color:sm.color }}>#{t.number}</span>
                          <span style={{ fontSize:13, fontWeight:600, color:"var(--text1)" }}>{t.title}</span>
                          {t.user&&<span style={{ fontSize:11, color:"var(--text2)", marginLeft:"auto" }}>{t.user}</span>}
                        </div>
                        {t.notes&&<div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6, paddingLeft:16 }}>{t.notes}</div>}
                      </div>
                    );
                  })}
                </>
              )}

              {/* Handoff notes */}
              {logs.some(d=>d.handoff)&&(
                <>
                  <div className="section-label" style={{ margin:"18px 0 10px" }}>HANDOFF NOTES</div>
                  {logs.filter(d=>d.handoff).map(d=>(
                    <div key={d.id} className="it-ticket" style={{ borderLeft:"3px solid #8040c0" }}>
                      <div style={{ fontSize:11, color:"var(--text2)", marginBottom:5, fontWeight:600 }}>{fmtDate(d.date)}</div>
                      <div style={{ fontSize:13, color:"var(--text1)", lineHeight:1.65 }}>{d.handoff}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>
          <div className="panel" style={{ marginBottom:14 }}>
            <div className="panel-header"><div className="panel-title">Quick Stats</div></div>
            {[
              { l:"Total tickets",  v:totalT,    color:"var(--text1)" },
              { l:"Resolved",       v:resolvedT, color:"var(--pill-up)" },
              { l:"Open",           v:openT,     color:"var(--pill-dn)" },
              { l:"In progress",    v:inProgT,   color:"#4060c0"       },
              { l:"Days logged",    v:logs.length, color:"var(--text1)" },
            ].map(s=>(
              <div key={s.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontSize:13, color:"var(--text2)" }}>{s.l}</span>
                <span style={{ fontSize:14, fontWeight:700, color:s.color }}>{s.v}</span>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title">Resolution Rate</div></div>
            <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:32, fontWeight:800, color:"var(--pill-up)", marginBottom:8 }}>
              {totalT>0?Math.round((resolvedT/totalT)*100):0}%
            </div>
            <div style={{ background:"var(--border)", borderRadius:6, height:8, overflow:"hidden" }}>
              <div className="xp-fill" style={{ width:(totalT>0?Math.round((resolvedT/totalT)*100):0)+"%", height:"100%", background:"var(--pill-up)", borderRadius:6 }}/>
            </div>
            <div style={{ fontSize:12, color:"var(--text2)", marginTop:8 }}>{resolvedT} of {totalT} tickets resolved</div>
          </div>
        </div>

      </div>
    </div>
  );
}
