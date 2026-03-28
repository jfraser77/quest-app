export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;}

:root{
  --bg:#dad8f9;--surface:#ffffff;--surface2:#f4f3f8;
  --border:#ece9f8;--text1:#352b38;--text2:#7e808c;--text3:#b0aec0;
  --lavender:#dad8f9;--accent:#352b38;
  --card-a:linear-gradient(135deg,#eceaf9,#f4f3f8);
  --card-b:linear-gradient(135deg,#deeeff,#f0f6ff);
  --card-c:linear-gradient(135deg,#f7dcf4,#fff0fc);
  --card-d:linear-gradient(135deg,#dcf7e8,#f0fff6);
  --shadow:0 2px 14px rgba(53,43,56,0.07);
  --shadow-lg:0 4px 28px rgba(53,43,56,0.12);
  --pill-up-bg:#e0f7ee;--pill-up:#1a8a50;
  --pill-dn-bg:#fde8e8;--pill-dn:#c04040;
  --toggle-bg:#e0ddf0;
}
[data-theme="dark"]{
  --bg:#0f0c18;--surface:#18142a;--surface2:#201c30;
  --border:#2c2640;--text1:#ece8ff;--text2:#8880a8;--text3:#4a4468;
  --lavender:#2a2444;--accent:#c8c0f4;
  --card-a:linear-gradient(135deg,#221e36,#18142a);
  --card-b:linear-gradient(135deg,#162034,#12182a);
  --card-c:linear-gradient(135deg,#2c1428,#1e1020);
  --card-d:linear-gradient(135deg,#122a1c,#0e1e14);
  --shadow:0 2px 14px rgba(0,0,0,0.35);
  --shadow-lg:0 4px 28px rgba(0,0,0,0.5);
  --pill-up-bg:#0e2e1e;--pill-up:#50cc80;
  --pill-dn-bg:#2e0e0e;--pill-dn:#f07070;
  --toggle-bg:#2a2444;
}

body{background:var(--bg);font-family:'Urbanist',sans-serif;color:var(--text1);transition:background 0.3s,color 0.3s;}

/* SHELL */
.app-shell{display:flex;min-height:100vh;}

/* SIDEBAR */
.sidebar{
  width:68px;background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;
  padding:16px 0 20px;position:fixed;top:0;left:0;bottom:0;
  z-index:200;box-shadow:var(--shadow);
  transition:background 0.3s,border-color 0.3s;
}
.sidebar-logo{
  width:40px;height:40px;background:var(--text1);border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:28px;flex-shrink:0;
  font-size:20px;color:#fff;font-weight:800;
  transition:background 0.3s;
}
.sidebar-nav{display:flex;flex-direction:column;gap:4px;flex:1;align-items:center;width:100%;padding:0 10px;}
.nav-item{
  width:44px;height:44px;border-radius:12px;border:none;
  background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:20px;transition:all 0.15s;color:var(--text2);position:relative;
}
.nav-item:hover{background:var(--surface2);color:var(--text1);}
.nav-item.active{background:var(--lavender);color:var(--text1);}
.nav-item.active::before{
  content:'';position:absolute;left:-10px;top:50%;transform:translateY(-50%);
  width:3px;height:22px;background:var(--text1);border-radius:0 3px 3px 0;
}
.sidebar-bottom{display:flex;flex-direction:column;gap:4px;align-items:center;width:100%;padding:0 10px;}

/* MAIN */
.main-area{margin-left:68px;flex:1;display:flex;flex-direction:column;min-height:100vh;}

/* TOPBAR */
.topbar{
  background:var(--surface);border-bottom:1px solid var(--border);
  padding:14px 24px;display:flex;align-items:center;gap:12px;
  position:sticky;top:0;z-index:100;box-shadow:var(--shadow);
  transition:background 0.3s,border-color 0.3s;
}
.topbar-greeting{flex:1;min-width:0;}
.topbar-title{font-size:18px;font-weight:700;color:var(--text1);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.topbar-sub{font-size:12px;color:var(--text2);margin-top:1px;}
.topbar-search{
  background:var(--surface2);border:1px solid var(--border);border-radius:10px;
  padding:8px 14px;font-family:'Urbanist',sans-serif;font-size:13px;
  color:var(--text1);outline:none;width:180px;
  transition:border-color 0.15s,background 0.3s;
}
.topbar-search:focus{border-color:var(--text1);}
.topbar-search::placeholder{color:var(--text3);}
.topbar-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.icon-btn{
  width:36px;height:36px;border-radius:10px;
  border:1px solid var(--border);background:var(--surface2);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:16px;color:var(--text1);transition:all 0.15s;
}
.icon-btn:hover{background:var(--lavender);}

/* DARK TOGGLE */
.theme-toggle{
  width:52px;height:28px;border-radius:14px;
  background:var(--toggle-bg);border:none;cursor:pointer;
  position:relative;padding:0;transition:background 0.3s;flex-shrink:0;
}
.theme-toggle-thumb{
  width:22px;height:22px;border-radius:50%;background:var(--text1);
  position:absolute;top:3px;left:3px;
  transition:transform 0.25s cubic-bezier(.4,0,.2,1),background 0.3s;
  display:flex;align-items:center;justify-content:center;font-size:11px;
}
[data-theme="dark"] .theme-toggle-thumb{transform:translateX(24px);}

/* CONTENT */
.content{padding:20px 24px 48px;}
.content-grid{display:grid;grid-template-columns:1fr 272px;gap:20px;align-items:start;}
.content-main{min-width:0;}
.content-right{min-width:0;}

/* STAT CARDS */
.stat-cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
.stat-card{
  background:var(--surface);border-radius:18px;padding:18px 20px;
  border:1px solid var(--border);box-shadow:var(--shadow);
  display:flex;flex-direction:column;min-height:164px;overflow:hidden;
  transition:box-shadow 0.2s,transform 0.2s,background 0.3s,border-color 0.3s;
  cursor:default;
}
.stat-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px);}
.stat-card-a{background:var(--card-a);}
.stat-card-b{background:var(--card-b);}
.stat-card-c{background:var(--card-c);}
.stat-card-d{background:var(--card-d);}
.stat-label{font-size:12px;font-weight:600;color:var(--text2);letter-spacing:0.03em;margin-bottom:6px;}
.stat-value{font-size:30px;font-weight:800;color:var(--text1);line-height:1;margin-bottom:6px;}
.stat-row{display:flex;align-items:center;gap:6px;}
.pill{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;}
.pill-up{background:var(--pill-up-bg);color:var(--pill-up);}
.pill-dn{background:var(--pill-dn-bg);color:var(--pill-dn);}
.stat-vs{font-size:10px;color:var(--text3);}
.mini-bars{display:flex;align-items:flex-end;gap:3px;margin-top:auto;padding-top:10px;height:48px;}
.mini-bar{flex:1;border-radius:4px 4px 2px 2px;opacity:0.7;transition:opacity 0.2s;}
.stat-card:hover .mini-bar{opacity:1;}

/* PANEL */
.panel{
  background:var(--surface);border-radius:18px;border:1px solid var(--border);
  box-shadow:var(--shadow);padding:18px 20px;
  transition:background 0.3s,border-color 0.3s;
}
.panel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.panel-title{font-size:14px;font-weight:700;color:var(--text1);}
.panel-more{background:transparent;border:none;cursor:pointer;color:var(--text3);font-size:20px;padding:0 2px;line-height:1;border-radius:6px;}
.panel-more:hover{color:var(--text1);}

/* PIPELINE TABLE */
.pipe-table{width:100%;border-collapse:collapse;font-size:13px;}
.pipe-table th{font-weight:600;color:var(--text2);padding:8px 10px;text-align:center;border-bottom:1px solid var(--border);font-size:11px;letter-spacing:0.03em;white-space:nowrap;}
.pipe-table th:first-child{text-align:left;}
.pipe-table td{padding:9px 10px;border-bottom:1px solid var(--border);color:var(--text1);text-align:center;}
.pipe-table td:first-child{text-align:left;font-weight:600;color:var(--text2);font-size:12px;white-space:nowrap;}
.pipe-table tr:last-child td{border-bottom:none;}
.pipe-table tr:hover td{background:var(--surface2);}
.pipe-chip{
  display:inline-flex;align-items:center;justify-content:center;
  min-width:34px;padding:4px 10px;border-radius:8px;
  font-size:12px;font-weight:700;
}
.pc-a{background:#eae6ff;color:#4830b0;}
.pc-b{background:#dceeff;color:#1860b0;}
.pc-c{background:#fce4f8;color:#901870;}
.pc-d{background:#dcf8ec;color:#187050;}
.pc-e{background:#fff0dc;color:#a06010;}
[data-theme="dark"] .pc-a{background:#221840;color:#c0a8ff;}
[data-theme="dark"] .pc-b{background:#102038;color:#80b8ff;}
[data-theme="dark"] .pc-c{background:#30102c;color:#f090d0;}
[data-theme="dark"] .pc-d{background:#102818;color:#60d890;}
[data-theme="dark"] .pc-e{background:#281800;color:#f0a840;}

/* RIGHT PANEL ITEMS */
.rp-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
.rp-item:last-child{border-bottom:none;}
.rp-icon{width:32px;height:32px;border-radius:9px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.rp-label{flex:1;min-width:0;}
.rp-name{font-size:13px;font-weight:600;color:var(--text1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rp-sub{font-size:11px;color:var(--text2);margin-top:1px;}
.rp-val{font-size:12px;font-weight:700;color:var(--text2);flex-shrink:0;}
.rp-bar-wrap{margin-top:5px;background:var(--border);border-radius:3px;height:4px;overflow:hidden;}
.rp-bar{height:100%;border-radius:3px;transition:width 0.6s ease;}

/* AVATAR */
.avatar{
  width:34px;height:34px;border-radius:50%;
  background:var(--lavender);display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;color:var(--text1);flex-shrink:0;
}
.badge-tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.04em;margin-top:3px;}
.badge-w{background:#eae6ff;color:#4830b0;}
.badge-m{background:#fce4f8;color:#901870;}
[data-theme="dark"] .badge-w{background:#221840;color:#c0a8ff;}
[data-theme="dark"] .badge-m{background:#30102c;color:#f090d0;}

/* QUEST CARDS */
.q-card{
  background:var(--surface);border-radius:14px;border:1px solid var(--border);
  padding:14px 16px;margin-bottom:10px;cursor:pointer;
  transition:all 0.15s;box-shadow:0 1px 6px rgba(53,43,56,0.04);
}
.q-card:hover{box-shadow:var(--shadow);border-color:var(--text2);transform:translateY(-1px);}
.q-card.done{opacity:0.4;}
.q-card.flash{animation:qflash 0.45s ease;}
@keyframes qflash{0%{background:var(--surface)}35%{background:var(--lavender)}100%{background:var(--surface)}}

/* FORMS */
input,textarea,select{
  background:var(--surface2);border:1px solid var(--border);border-radius:10px;
  padding:9px 13px;color:var(--text1);font-size:13px;
  font-family:'Urbanist',sans-serif;width:100%;outline:none;
  transition:border-color 0.15s,background 0.3s;
}
input:focus,textarea:focus,select:focus{border-color:var(--text1);}
input::placeholder,textarea::placeholder{color:var(--text3);}
select option{background:var(--surface);}

/* BUTTONS */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 16px;border-radius:10px;border:1px solid var(--border);
  background:var(--surface2);color:var(--text1);
  font-family:'Urbanist',sans-serif;font-size:13px;font-weight:600;
  cursor:pointer;transition:all 0.15s;
}
.btn:hover{background:var(--lavender);border-color:var(--text2);}
.btn-primary{background:var(--text1);border-color:var(--text1);color:var(--surface);}
.btn-primary:hover{opacity:0.85;}
.btn-full{width:100%;}
.btn-dashed{border-style:dashed;color:var(--text2);width:100%;margin-top:6px;}
.btn-dashed:hover{border-color:var(--text1);color:var(--text1);}
.btn-danger{color:#c04040;border-color:#f0c8c8;}
.btn-danger:hover{background:#fde8e8;border-color:#c04040;}
.btn-sm{padding:5px 12px;font-size:12px;}

/* ENTER CARDS */
.enter-card{
  background:var(--surface);border-radius:16px;border:1px solid var(--border);
  padding:16px 18px;display:flex;align-items:center;gap:14px;
  cursor:pointer;transition:all 0.18s;box-shadow:var(--shadow);width:100%;text-align:left;
}
.enter-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px);border-color:var(--text2);}
.enter-card-title{font-size:14px;font-weight:700;color:var(--text1);}
.enter-card-sub{font-size:11px;color:var(--text2);margin-top:2px;}

/* TABS */
.tabs{display:flex;gap:2px;background:var(--surface2);border-radius:10px;padding:3px;margin-bottom:16px;}
.tab-btn{
  flex:1;padding:7px 12px;border-radius:8px;border:none;
  background:transparent;font-family:'Urbanist',sans-serif;font-size:12px;font-weight:600;
  cursor:pointer;color:var(--text2);transition:all 0.15s;white-space:nowrap;
}
.tab-btn.active{background:var(--surface);color:var(--text1);box-shadow:0 1px 6px rgba(53,43,56,0.08);}
[data-theme="dark"] .tab-btn.active{box-shadow:0 1px 6px rgba(0,0,0,0.3);}

/* SECTION LABELS */
.section-label{font-size:11px;font-weight:700;color:var(--text2);letter-spacing:0.08em;margin-bottom:10px;}
.section-divider{
  font-size:11px;font-weight:700;color:var(--text2);letter-spacing:0.08em;
  margin:16px 0 10px;display:flex;align-items:center;gap:8px;
}
.section-divider::after{content:'';flex:1;height:1px;background:var(--border);}

/* STREAK PIPS */
.day-pip{
  width:32px;height:32px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:600;border:1px solid var(--border);
  color:var(--text2);background:transparent;cursor:pointer;transition:all 0.15s;
}
.day-pip.today{background:var(--text1);color:var(--surface);border-color:var(--text1);}
.day-pip.past{background:var(--lavender);color:var(--text1);border-color:transparent;}

/* XP BAR */
.xp-fill{transition:width 0.5s cubic-bezier(.4,0,.2,1);}

/* ANIMATIONS */
.reveal{animation:up 0.22s ease;}
@keyframes up{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}

/* IT LOG SPECIFIC */
.it-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.it-ticket{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:12px 14px;margin-bottom:8px;transition:border-color 0.15s,background 0.3s;}
.it-ticket:hover{border-color:var(--text2);}
.badge-tag-it{display:inline-block;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.04em;}
.status-resolved{background:var(--pill-up-bg);color:var(--pill-up);}
.status-open{background:var(--pill-dn-bg);color:var(--pill-dn);}
.status-inprogress{background:#e8eeff;color:#3050c0;}
.status-escalated{background:#fff0dc;color:#a06010;}
[data-theme="dark"] .status-inprogress{background:#0e1838;color:#8090f0;}
[data-theme="dark"] .status-escalated{background:#281800;color:#f0a840;}

/* FEED */
.feed-card{background:var(--surface);border-radius:14px;border:1px solid var(--border);padding:14px 16px;margin-bottom:10px;transition:background 0.3s,border-color 0.3s;}
.prompt-item{padding:10px 13px;background:var(--surface2);border-radius:10px;border:1px solid var(--border);cursor:pointer;font-size:13px;color:var(--text2);line-height:1.5;transition:all 0.15s;margin-bottom:7px;}
.prompt-item:hover{border-color:var(--text2);color:var(--text1);}
.prompt-item.active{background:var(--lavender);border-color:var(--text1);color:var(--text1);}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}

/* RESPONSIVE */
@media(max-width:1023px){
  .content-grid{grid-template-columns:1fr;}
  .content-right{display:none;}
  .stat-cards-row{grid-template-columns:repeat(2,1fr);}
  .topbar-search{width:140px;}
}
@media(max-width:767px){
  .sidebar{
    width:100%;height:58px;flex-direction:row;
    top:auto;bottom:0;left:0;right:0;
    border-right:none;border-top:1px solid var(--border);
    padding:0 6px;box-shadow:0 -2px 12px rgba(53,43,56,0.08);
  }
  .sidebar-logo{display:none;}
  .sidebar-nav{flex-direction:row;justify-content:center;gap:0;padding:0;}
  .sidebar-bottom{flex-direction:row;padding:0;gap:0;}
  .nav-item{width:52px;height:50px;font-size:22px;}
  .nav-item.active::before{
    left:50%;top:auto;bottom:-2px;transform:translateX(-50%);
    width:20px;height:3px;border-radius:3px 3px 0 0;
  }
  .main-area{margin-left:0;margin-bottom:58px;}
  .topbar{padding:10px 16px;}
  .topbar-search{display:none;}
  .topbar-title{font-size:16px;}
  .content{padding:14px 14px 28px;}
  .stat-cards-row{grid-template-columns:1fr 1fr;}
  .stat-value{font-size:24px;}
}
@media(max-width:479px){
  .stat-cards-row{grid-template-columns:1fr;}
  .stat-card{min-height:120px;}
  .mini-bars{height:36px;}
  .content{padding:12px 12px 20px;}
  .topbar-title{font-size:15px;}
}
`;

export const T = {
  text1:  { color:'var(--text1)' },
  text2:  { color:'var(--text2)' },
  text3:  { color:'var(--text3)' },
  label:  { fontSize:11, fontWeight:700, color:'var(--text2)', letterSpacing:'0.08em' },
  title:  { fontFamily:"'Urbanist',sans-serif", fontWeight:800, color:'var(--text1)' },
  panel:  { background:'var(--surface)', borderRadius:18, border:'1px solid var(--border)', padding:'18px 20px', boxShadow:'var(--shadow)' },
};
