// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const QUEST_TYPES = ["work","growth","relationship","body","home","self","ops","learn","personal","close"];

export const TYPE_COLOR = {
  work:         "#5a7fd4",
  growth:       "#4aaa7a",
  relationship: "#d45a7a",
  body:         "#c4954a",
  home:         "#7a94c4",
  self:         "#9a5ac4",
  ops:          "#5a94a4",
  learn:        "#7aaa4a",
  personal:     "#c47a5a",
  close:        "#d4a857",
};

export const SECTIONS = [
  { id: "morning",  label: "Morning",       defaultTime: "6:00–9:00 AM"    },
  { id: "work",     label: "Work Block",    defaultTime: "9:00 AM–5:00 PM" },
  { id: "learning", label: "Learning",      defaultTime: "Flex"             },
  { id: "personal", label: "Personal",      defaultTime: "Evening"          },
  { id: "closing",  label: "Closing Ritual",defaultTime: "Before Bed"       },
];

export const LEVEL_NAMES = ["Recruit","Adventurer","Warrior","Champion","Legend"];
export const getLevel = (xp) =>
  xp < 200 ? 0 : xp < 500 ? 1 : xp < 1000 ? 2 : xp < 2000 ? 3 : 4;

// ─── QUEST PRESETS ────────────────────────────────────────────────────────────

export const JOE_QUESTS = {
  0: [
    { title:"Weekly reset & plan",        desc:"Fill out tomorrow's board. 3 non-negotiables.",              xp:60,  type:"growth",       section:"morning"  },
    { title:"Cook for Liz",               desc:"Pick a night. Handle logistics. Just tell her when.",         xp:65,  type:"relationship", section:"personal" },
    { title:"Read 1 chapter NMMNG",       desc:"One chapter, one journal note.",                              xp:50,  type:"growth",       section:"personal" },
    { title:"Clean something",            desc:"Most visible mess. 10 minutes. Done.",                        xp:30,  type:"home",         section:"closing"  },
  ],
  1: [
    { title:"IT tickets blitz",           desc:"Close 5+ tickets before lunch.",                              xp:80,  type:"work",         section:"work"     },
    { title:"Claude Code 30 min",         desc:"Open the portal. Ship one thing.",                            xp:70,  type:"learn",        section:"learning" },
    { title:"5-min check-in with Liz",    desc:"Not logistics. Something real.",                              xp:25,  type:"relationship", section:"personal" },
    { title:"Mobility routine",           desc:"Fascia work. Hip flexors. 15 min.",                           xp:30,  type:"body",         section:"morning"  },
  ],
  2: [
    { title:"Day trading module",         desc:"One Udemy lesson. Take notes on paper.",                      xp:70,  type:"learn",        section:"learning" },
    { title:"LinkedIn Learning block",    desc:"Claude Code mod — active watch.",                             xp:65,  type:"learn",        section:"learning" },
    { title:"Send Liz something dumb",    desc:"Meme. Video. Proof of life.",                                 xp:20,  type:"relationship", section:"personal" },
    { title:"Nice Guy pattern check",     desc:"Spot one people-pleasing moment. Log it.",                    xp:40,  type:"growth",       section:"closing"  },
  ],
  3: [
    { title:"Portal code sprint",         desc:"IT Management Portal — one feature or bug fix.",              xp:80,  type:"learn",        section:"learning" },
    { title:"Work ticket sweep",          desc:"Clear the queue. Zero inbox.",                                xp:60,  type:"work",         section:"work"     },
    { title:"Journal: purpose check-in",  desc:"Read your purpose statement. Where are you vs. going?",      xp:45,  type:"growth",       section:"personal" },
    { title:"Reach out first",            desc:"Text or call Liz — you initiate.",                            xp:30,  type:"relationship", section:"personal" },
  ],
  4: [
    { title:"New hire & SOP work",        desc:"Knock out one SOP or laptop setup.",                          xp:55,  type:"work",         section:"work"     },
    { title:"Trading research",           desc:"Watch one Buffett lesson. Extract 3 ideas.",                  xp:60,  type:"learn",        section:"learning",boss:true },
    { title:"Plan the weekend",           desc:"Pick one thing for you + Liz. Tell her — don't ask.",         xp:50,  type:"relationship", section:"personal",boss:true },
    { title:"Gym",                        desc:"Show up. Even if sore. Showing up IS the win.",               xp:70,  type:"body",         section:"closing"  },
  ],
  5: [
    { title:"Wrap work strong",           desc:"Zero open tickets going into the weekend.",                   xp:60,  type:"work",         section:"work"     },
    { title:"30-min tunnel: app idea",    desc:"Sketch one profitable app concept. No filtering.",            xp:65,  type:"learn",        section:"learning",boss:true },
    { title:"Movie night locked in",      desc:"Confirm with Liz. You handle snacks.",                        xp:70,  type:"relationship", section:"personal",boss:true },
    { title:"I AM list",                  desc:"Read your 10 I AM statements aloud.",                         xp:35,  type:"growth",       section:"closing"  },
  ],
  6: [
    { title:"Gym",                        desc:"Saturday session. Earn the weekend.",                         xp:70,  type:"body",         section:"morning"  },
    { title:"Something new — all 3",      desc:"One activity with Liz & Spencer neither has done.",           xp:100, type:"relationship", section:"personal",boss:true },
    { title:"Code 1 hour",                desc:"No meetings. No excuses. Build.",                             xp:75,  type:"learn",        section:"learning" },
    { title:"Gratitude entry",            desc:"3 things you built or protected this week.",                  xp:40,  type:"growth",       section:"closing"  },
  ],
};

export const LIZ_QUESTS = {
  0: [
    { title:"Weekly intention",           desc:"What does a good week with Joe look like?",                   xp:45,  type:"growth",       section:"morning"  },
    { title:"Spencer + me time",          desc:"One unscheduled hour — zero guilt.",                          xp:50,  type:"self",         section:"personal" },
    { title:"Send Joe one specific compliment", desc:"Not 'you're great.' What did he actually do right?",   xp:30,  type:"relationship", section:"personal" },
    { title:"Home reset",                 desc:"One visible area. 15 minutes.",                               xp:35,  type:"home",         section:"closing"  },
  ],
  1: [
    { title:"Direct ask",                 desc:"One thing you need from Joe — say it plainly.",               xp:40,  type:"relationship", section:"morning"  },
    { title:"Morning routine locked",     desc:"Spencer prepped and out without the chaos spiral.",           xp:45,  type:"self",         section:"morning"  },
    { title:"Work win",                   desc:"Name one thing you did really well at work today.",           xp:30,  type:"growth",       section:"closing"  },
    { title:"Pattern check",             desc:"If something bothered you — his action or old story?",        xp:40,  type:"growth",       section:"closing"  },
  ],
  2: [
    { title:"Something just for Liz",    desc:"Hobby, show, walk — unrelated to anyone else.",               xp:50,  type:"self",         section:"personal" },
    { title:"Reach out first",           desc:"You initiate contact today.",                                  xp:30,  type:"relationship", section:"morning"  },
    { title:"Journal: what do I need?",  desc:"Not what I should need. What do I actually need?",            xp:45,  type:"growth",       section:"personal" },
    { title:"Acknowledge Joe's growth",  desc:"Even small. Especially small.",                               xp:25,  type:"relationship", section:"closing"  },
  ],
  3: [
    { title:"Work leadership rep",       desc:"One moment you led confidently. Recognize it.",               xp:40,  type:"growth",       section:"closing"  },
    { title:"Spencer special moment",    desc:"One thing just for him — his pick.",                          xp:35,  type:"self",         section:"personal" },
    { title:"Interrupt silence early",   desc:"If Joe goes quiet — ask once within 24h. Then space.",        xp:45,  type:"relationship", section:"personal" },
    { title:"Meal prep something",       desc:"One less decision tomorrow.",                                  xp:30,  type:"home",         section:"closing"  },
  ],
  4: [
    { title:"Vulnerability rep",         desc:"Share one real thing with Joe. Not a complaint — something true.", xp:60, type:"relationship", section:"personal", boss:true },
    { title:"30 min of silence",         desc:"No phone. No task. Just exist.",                              xp:40,  type:"self",         section:"personal" },
    { title:"What am I avoiding?",       desc:"One thing you haven't let yourself look at directly.",        xp:50,  type:"growth",       section:"closing"  },
    { title:"Confirm weekend plans",     desc:"Check in on Joe's plan. Don't fill in his gaps.",             xp:25,  type:"relationship", section:"morning"  },
  ],
  5: [
    { title:"Work week closed strong",   desc:"One thing wrapped before you leave. Clean exit.",             xp:50,  type:"growth",       section:"work"     },
    { title:"Get dressed for you",       desc:"Whatever makes you feel like yourself.",                      xp:30,  type:"self",         section:"morning"  },
    { title:"Movie night — just show up",desc:"Let Joe handle logistics. Your job: be present.",             xp:55,  type:"relationship", section:"personal" },
    { title:"What's been great?",        desc:"Name one thing out loud.",                                    xp:35,  type:"growth",       section:"closing"  },
  ],
  6: [
    { title:"Workout or walk",           desc:"Move your body for you.",                                     xp:55,  type:"self",         section:"morning"  },
    { title:"Something new — all 3",     desc:"Say yes to whatever Joe planned. Let it be imperfect.",       xp:100, type:"relationship", section:"personal",boss:true },
    { title:"Monthly relationship check-in", desc:"Two questions each. No scorekeeping.",                   xp:90,  type:"relationship", section:"personal",boss:true },
    { title:"Rest without guilt",        desc:"You carried the week. Putting it down is allowed.",           xp:40,  type:"self",         section:"closing"  },
  ],
};

export const FEED_PROMPTS = [
  "What's one thing the other person did recently that you haven't said thank you for?",
  "Describe your perfect lazy Sunday together in 3 words.",
  "What's something you've been nervous to bring up?",
  "What does 'feeling safe with you' look like on a regular Tuesday?",
  "Name one thing I do that makes Spencer smile.",
  "What song makes you think of us lately?",
  "What's one thing you're proud of yourself for this week?",
  "If you could plan our next date — no budget limit — what would it be?",
  "What do you need more of from me right now?",
  "Describe the version of us you're rooting for.",
  "What's one thing you assumed about me that turned out to be wrong?",
  "When do you feel most like yourself around me?",
];
