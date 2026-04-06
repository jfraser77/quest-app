import React, { useState } from "react";
import { FEED_PROMPTS } from "../data";
import { WarriorAvatar, MageAvatar } from "../avatars";
import type { FeedPost } from "../types";
import type { UseFeedReturn } from "../hooks";

const JOE_COLOR = "#6a50d0";
const LIZ_COLOR = "#c040a0";

interface PlayerBarProps {
  label:  string;
  Avatar: React.ComponentType<{ size?: number }>;
  color:  string;
  xp:     number;
  done:   number;
  total:  number;
}

function PlayerBar({ label, Avatar, color, xp, done, total }: PlayerBarProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Avatar size={26} />
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{label}</span>
        <span style={{ marginLeft: "auto", fontFamily: "'Urbanist',sans-serif", fontSize: 15, fontWeight: 800, color }}>
          {xp} XP
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, background: "var(--border)", borderRadius: 6, height: 7, overflow: "hidden" }}>
          <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 6, transition: "width 0.4s" }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text2)", whiteSpace: "nowrap" }}>
          {done}/{total} quests
        </span>
      </div>
    </div>
  );
}

interface FeedCardProps {
  post: FeedPost;
}

function FeedCard({ post }: FeedCardProps) {
  const isJoe   = post.player === "Joe";
  const color   = isJoe ? JOE_COLOR : LIZ_COLOR;
  const Avatar  = isJoe ? WarriorAvatar : MageAvatar;
  const date    = new Date(post.created_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="feed-card" style={{ borderLeft: `3px solid ${color}`, marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <Avatar size={32} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color }}>{post.player}</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>{dateStr} · {timeStr}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic", marginBottom: 6, lineHeight: 1.5 }}>
        "{post.prompt}"
      </div>
      <div style={{ fontSize: 13, color: "var(--text1)", lineHeight: 1.65 }}>{post.answer}</div>
    </div>
  );
}

interface SharedRealmProps {
  currentPlayer: "joe" | "liz";
  joeXP:         number;
  lizXP:         number;
  joeDone:       number;
  lizDone:       number;
  joeTotal:      number;
  lizTotal:      number;
  feedHook:      UseFeedReturn;
  onBack:        () => void;
}

export default function SharedRealm({
  currentPlayer,
  joeXP, lizXP,
  joeDone, lizDone,
  joeTotal, lizTotal,
  feedHook,
}: SharedRealmProps) {
  const { posts, feedLoading, addPost } = feedHook;

  const myName  = currentPlayer === "joe" ? "Joe" : "Liz";
  const myColor = currentPlayer === "joe" ? JOE_COLOR : LIZ_COLOR;

  const [activePrompt,    setActivePrompt]    = useState<string | null>(null);
  const [draft,           setDraft]           = useState<string>("");
  const [posting,         setPosting]         = useState<boolean>(false);
  const [showAllPrompts,  setShowAllPrompts]  = useState<boolean>(false);

  const handlePost = async () => {
    if (!draft.trim() || !activePrompt) return;
    setPosting(true);
    await addPost(myName, activePrompt, draft);
    setDraft("");
    setActivePrompt(null);
    setPosting(false);
  };

  const rndPrompt = () => {
    const opts = FEED_PROMPTS.filter(p => p !== activePrompt);
    setActivePrompt(opts[Math.floor(Math.random() * opts.length)]);
    setDraft("");
  };

  const totalXP  = joeXP + lizXP;
  const joeLeads = joeXP >= lizXP;

  return (
    <div className="content">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 272px", gap: 20, alignItems: "start" }}>

        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-header" style={{ marginBottom: 12 }}>
              <div className="panel-title">Shared Realm</div>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>posting as <strong style={{ color: myColor }}>{myName}</strong></span>
            </div>

            {!activePrompt ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" onClick={rndPrompt}>🎲 Random prompt</button>
                <button className="btn btn-sm" onClick={() => setShowAllPrompts(v => !v)}>
                  {showAllPrompts ? "Hide prompts" : "Browse prompts"}
                </button>
              </div>
            ) : (
              <div className="reveal">
                <div style={{
                  padding: "12px 14px", background: "var(--surface2)", borderRadius: 10,
                  border: `1px solid ${myColor}44`, marginBottom: 10,
                }}>
                  <div style={{ fontSize: 13, color: "var(--text1)", lineHeight: 1.7, fontStyle: "italic" }}>
                    "{activePrompt}"
                  </div>
                </div>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Your answer..."
                  rows={3}
                  style={{ resize: "none", marginBottom: 10 }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn btn-sm" onClick={() => { setActivePrompt(null); setDraft(""); }}
                    style={{ color: "var(--text3)" }}>
                    Cancel
                  </button>
                  <button className="btn btn-sm" onClick={rndPrompt} style={{ color: "var(--text2)" }}>
                    🎲 Different prompt
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginLeft: "auto" }}
                    onClick={handlePost}
                    disabled={!draft.trim() || posting}
                  >
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            )}

            {showAllPrompts && !activePrompt && (
              <div className="reveal" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", letterSpacing: "0.06em", marginBottom: 8 }}>
                  PICK A PROMPT
                </div>
                {FEED_PROMPTS.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => { setActivePrompt(p); setShowAllPrompts(false); }}
                    style={{
                      padding: "9px 12px", borderRadius: 8, fontSize: 13, color: "var(--text1)",
                      cursor: "pointer", marginBottom: 4, border: "1px solid transparent",
                      lineHeight: 1.5,
                    }}
                    className="prompt-item"
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header" style={{ marginBottom: 12 }}>
              <div className="panel-title">Feed</div>
              <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>

            {feedLoading && (
              <div style={{ textAlign: "center", fontSize: 13, color: "var(--text3)", padding: "20px 0" }}>
                Loading…
              </div>
            )}

            {!feedLoading && posts.length === 0 && (
              <div style={{ textAlign: "center", fontSize: 13, color: "var(--text3)", padding: "24px 0" }}>
                No posts yet — draw a prompt and be first 🔮
              </div>
            )}

            {posts.map(p => <FeedCard key={p.id} post={p} />)}
          </div>
        </div>

        <div>
          <div className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-header" style={{ marginBottom: 14 }}>
              <div className="panel-title">Today's Battle</div>
              <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{totalXP} XP combined</span>
            </div>

            <PlayerBar label="Joe" Avatar={WarriorAvatar} color={JOE_COLOR} xp={joeXP} done={joeDone} total={joeTotal} />
            <PlayerBar label="Liz" Avatar={MageAvatar}    color={LIZ_COLOR} xp={lizXP} done={lizDone} total={lizTotal} />

            {totalXP > 0 && (
              <div style={{
                marginTop: 4, padding: "8px 12px", borderRadius: 10,
                background: "var(--surface2)", border: "1px solid var(--border)",
                fontSize: 12, color: "var(--text2)", textAlign: "center",
              }}>
                {joeXP === lizXP
                  ? "⚖️ Perfectly tied"
                  : `${joeLeads ? "Joe" : "Liz"} leads by ${Math.abs(joeXP - lizXP)} XP`}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header" style={{ marginBottom: 10 }}>
              <div className="panel-title">Leaderboard</div>
            </div>
            {[
              { name: "Joe", xp: joeXP, done: joeDone, total: joeTotal, A: WarriorAvatar, c: JOE_COLOR, badge: "badge-w", role: "Warrior" },
              { name: "Liz", xp: lizXP, done: lizDone, total: lizTotal, A: MageAvatar,    c: LIZ_COLOR, badge: "badge-m", role: "Mage" },
            ].sort((a, b) => b.xp - a.xp).map((p, i) => {
              const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
              return (
                <div key={p.name} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0",
                  borderBottom: i === 0 ? "1px solid var(--border)" : "none",
                }}>
                  <span style={{ fontSize: 18, width: 22 }}>{i === 0 ? "🥇" : "🥈"}</span>
                  <p.A size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)" }}>{p.name}</span>
                      <span className={`badge-tag ${p.badge}`}>{p.role}</span>
                    </div>
                    <div style={{ background: "var(--border)", borderRadius: 4, height: 5, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: p.c, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Urbanist',sans-serif", fontSize: 16, fontWeight: 800, color: p.c }}>
                    {p.xp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
