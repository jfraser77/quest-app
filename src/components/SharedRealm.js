import React, { useState } from "react";
import { FEED_PROMPTS } from "../data";
import { WarriorAvatar, MageAvatar } from "../avatars";

export default function SharedRealm({ joeXP, lizXP, joeDone, lizDone, feedHook }) {
  const { posts, addPost } = feedHook;
  const [activePrompt, setActivePrompt] = useState(null);
  const [draft,  setDraft]  = useState("");
  const [postAs, setPostAs] = useState("Joe");

  const handlePost = () => {
    if (addPost(postAs, activePrompt, draft)) {
      setDraft(""); setActivePrompt(null);
    }
  };

  const rndPrompt = () => {
    const opts = FEED_PROMPTS.filter(p => p !== activePrompt);
    setActivePrompt(opts[Math.floor(Math.random() * opts.length)]);
  };

  return (
    <div className="content">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 272px", gap:20, alignItems:"start" }}>

        {/* LEFT: FEED */}
        <div>
          {/* POST COMPOSER */}
          <div className="panel" style={{ marginBottom:20 }}>
            <div className="panel-header">
              <div className="panel-title">Post to Feed</div>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              <button className="btn btn-primary btn-sm" onClick={rndPrompt}>🎲 Random prompt</button>
            </div>

            {activePrompt && (
              <div className="reveal">
                <div style={{ padding:"12px 14px", background:"var(--surface2)", borderRadius:10, border:"1px solid var(--border)", marginBottom:10 }}>
                  <div style={{ fontSize:13, color:"var(--text1)", lineHeight:1.7, fontStyle:"italic" }}>
                    "{activePrompt}"
                  </div>
                </div>
                <textarea value={draft} onChange={e=>setDraft(e.target.value)}
                  placeholder="Your answer..." rows={3} style={{ resize:"none", marginBottom:10 }}/>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:"var(--text2)", fontWeight:600 }}>Post as:</span>
                  <button className="btn btn-sm" onClick={()=>setPostAs("Joe")}
                    style={{ borderColor:postAs==="Joe"?"#6a50d0":"var(--border)", background:postAs==="Joe"?"#eae6ff":"var(--surface2)", color:postAs==="Joe"?"#4830b0":"var(--text2)" }}>
                    ⚔ Joe
                  </button>
                  <button className="btn btn-sm" onClick={()=>setPostAs("Liz")}
                    style={{ borderColor:postAs==="Liz"?"#c040a0":"var(--border)", background:postAs==="Liz"?"#fce4f8":"var(--surface2)", color:postAs==="Liz"?"#901870":"var(--text2)" }}>
                    ✨ Liz
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ marginLeft:"auto" }} onClick={handlePost}>Post</button>
                </div>
              </div>
            )}
          </div>

          {/* PROMPT LIST */}
          <div className="panel" style={{ marginBottom:20 }}>
            <div className="panel-header"><div className="panel-title">All Prompts</div></div>
            {FEED_PROMPTS.map((p,i)=>(
              <div key={i} className={`prompt-item${activePrompt===p?" active":""}`} onClick={()=>setActivePrompt(p)}>
                {p}
              </div>
            ))}
          </div>

          {/* FEED POSTS */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Feed</div>
              <span style={{ fontSize:12, color:"var(--text2)", fontWeight:600 }}>{posts.length} posts</span>
            </div>
            {posts.length === 0 && (
              <div style={{ textAlign:"center", fontSize:13, color:"var(--text3)", padding:"24px 0" }}>
                No posts yet — draw a prompt and post first 🔮
              </div>
            )}
            {posts.map(f=>{
              const isJ = f.player==="Joe";
              return (
                <div key={f.id} className="feed-card" style={{ borderLeft:`3px solid ${isJ?"#6a50d0":"#c040a0"}` }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                    {isJ?<WarriorAvatar size={32}/>:<MageAvatar size={32}/>}
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:isJ?"#6a50d0":"#c040a0" }}>{f.player}</div>
                      <div style={{ fontSize:10, color:"var(--text3)" }}>{new Date(f.ts).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", fontStyle:"italic", marginBottom:8, lineHeight:1.5 }}>"{f.prompt}"</div>
                  <div style={{ fontSize:13, color:"var(--text1)", lineHeight:1.65 }}>{f.answer}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: STATS */}
        <div>
          <div className="panel" style={{ marginBottom:14 }}>
            <div className="panel-header"><div className="panel-title">Stats</div></div>
            {[
              { label:"Total XP",     joe:joeXP,  liz:lizXP  },
              { label:"Quests Done",  joe:joeDone, liz:lizDone },
            ].map(s=>(
              <div key={s.label} style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--text2)", letterSpacing:"0.06em", marginBottom:8 }}>
                  {s.label.toUpperCase()}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ textAlign:"center" }}>
                    <WarriorAvatar size={30}/>
                    <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:18, fontWeight:800, color:"#6a50d0", marginTop:4 }}>{s.joe}</div>
                  </div>
                  <div style={{ fontSize:12, color:"var(--text3)" }}>vs</div>
                  <div style={{ textAlign:"center" }}>
                    <MageAvatar size={30}/>
                    <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:18, fontWeight:800, color:"#c040a0", marginTop:4 }}>{s.liz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title">Leaderboard</div></div>
            {[
              { name:"Joe", xp:joeXP, done:joeDone, A:WarriorAvatar, c:"#6a50d0", badge:"badge-w", role:"Warrior" },
              { name:"Liz", xp:lizXP, done:lizDone, A:MageAvatar,    c:"#c040a0", badge:"badge-m", role:"Mage"    },
            ].sort((a,b)=>b.xp-a.xp).map((p,i)=>(
              <div key={p.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i===0?"1px solid var(--border)":"none" }}>
                <span style={{ fontSize:16, width:20 }}>{i===0?"🥇":"🥈"}</span>
                <p.A size={32}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--text1)" }}>{p.name}</div>
                  <span className={`badge-tag ${p.badge}`}>{p.role}</span>
                </div>
                <div style={{ fontFamily:"'Urbanist',sans-serif", fontSize:15, fontWeight:800, color:p.c }}>{p.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
