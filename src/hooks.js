

import { useState, useEffect, useCallback, useRef } from "react";
import {  SECTIONS } from "./data";
import { supabase } from "./supabase";

// ── Unique ID helper ──────────────────────────────────────────────────────────
export const newId = () =>
  `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ── Build a blank quest object ────────────────────────────────────────────────
export const blankQuest = (sectionId = "morning") => ({
  id:      newId(),
  title:   "",
  desc:    "",
  time:    "",
  xp:      50,
  type:    "growth",
  boss:    false,
  section: sectionId,
  custom:  true,
});

// ── Hydrate preset data into quest objects ────────────────────────────────────
// const hydratePresets = (presetMap) => {
//   const out = {};
//   SECTIONS.forEach(({ id }) => { out[id] = []; });
//   Object.entries(presetMap).forEach(([dayIdx, quests]) => {
//     quests.forEach((q) => {
//       const sec = q.section || "personal";
//       if (!out[sec]) out[sec] = [];
//       out[sec].push({ ...q, id: newId(), custom: false, day: Number(dayIdx) });
//     });
//   });
//   return out;
// };

// ── Build default quests from preset ─────────────────────────────────────────
function buildFromPreset(presetMap, dayIdx) {
  const out = {};
  SECTIONS.forEach(({ id }) => { out[id] = []; });
  (presetMap[dayIdx] || []).forEach((q) => {
    const sec = q.section || "personal";
    out[sec].push({ ...q, id: newId(), custom: false });
  });
  return out;
}

// ── usePlayer hook ────────────────────────────────────────────────────────────
// Manages one player's quests, done state, intention, and closing note.
export function usePlayer(presetMap, playerName = "unknown") {
  const todayIdx  = new Date().getDay();
  const todayDate = new Date().toISOString().slice(0, 10);

  // localStorage keys (fast offline cache)
  const questsKey    = `quests_${playerName}_${todayDate}`;
  const intentionKey = `intention_${playerName}_${todayDate}`;
  const noteKey      = `note_${playerName}_${todayDate}`;
  const doneKey      = `done_${playerName}_${todayDate}`;

  // ── State — seed from localStorage so the UI is instant on load ─────────────
  const [quests, setQuests] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(questsKey));
      if (saved && typeof saved === "object" && !Array.isArray(saved)) return saved;
    } catch {}
    return buildFromPreset(presetMap, todayIdx);
  });

  const [intention, setIntention] = useState(() => {
    try { return localStorage.getItem(intentionKey) || ""; } catch { return ""; }
  });

  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(noteKey) || ""; } catch { return ""; }
  });

  const [done, setDone] = useState({});
  const supabaseLoaded = useRef(false);

  // ── Supabase load on mount (authoritative cross-device source) ──────────────
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("player_day")
      .select("quests, intention, note, done_titles")
      .eq("player", playerName)
      .eq("date", todayDate)
      .single()
      .then(({ data }) => {
        supabaseLoaded.current = true; // always unblock saves, even with no existing row
        if (!data) return;
        // Use data.quests directly for done_titles matching (not stale closure)
        let loadedQuests = null;
        if (data.quests && typeof data.quests === "object" && !Array.isArray(data.quests)) {
          loadedQuests = data.quests;
          setQuests(data.quests);
          try { localStorage.setItem(questsKey, JSON.stringify(data.quests)); } catch {}
        }
        if (data.intention != null) {
          setIntention(data.intention);
          try { localStorage.setItem(intentionKey, data.intention); } catch {}
        }
        if (data.note != null) {
          setNote(data.note);
          try { localStorage.setItem(noteKey, data.note); } catch {}
        }
        if (data.done_titles && Array.isArray(data.done_titles) && data.done_titles.length > 0) {
          const questSource = loadedQuests || quests;
          const allQ = Object.values(questSource).flat();
          const restored = {};
          allQ.forEach((q) => {
            if (data.done_titles.includes(q.title)) restored[q.id] = true;
          });
          setDone(restored);
          try { localStorage.setItem(doneKey, JSON.stringify(data.done_titles)); } catch {}
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Combined persist: localStorage immediately, Supabase debounced ──────────
  const saveTimer = useRef(null);

  useEffect(() => {
    const allQ = Object.values(quests).flat();
    const doneTitles = allQ.filter((q) => done[q.id]).map((q) => q.title);

    // localStorage — instant
    try {
      localStorage.setItem(questsKey, JSON.stringify(quests));
      localStorage.setItem(intentionKey, intention);
      localStorage.setItem(noteKey, note);
      // Only write done after Supabase has loaded — prevents wiping real state on mount
      if (supabaseLoaded.current) {
        localStorage.setItem(doneKey, JSON.stringify(doneTitles));
      }
    } catch {}

    // Supabase — debounced 1.5 s so we don't write on every keystroke
    if (!supabase) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const payload = { player: playerName, date: todayDate, quests, intention, note };
      // Only include done_titles once we have authoritative state from Supabase
      if (supabaseLoaded.current) payload.done_titles = doneTitles;
      supabase.from("player_day").upsert(payload, { onConflict: "player,date" });
    }, 1500);
  }, [quests, intention, note, done]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restore done state from localStorage (skipped if Supabase already loaded) ─
  useEffect(() => {
    if (supabaseLoaded.current) return; // Supabase is authoritative; don't overwrite
    try {
      const saved = JSON.parse(localStorage.getItem(doneKey) || "[]");
      if (!Array.isArray(saved) || saved.length === 0) return;
      const allQ = Object.values(quests).flat();
      const restored = {};
      allQ.forEach((q) => { if (saved.includes(q.title)) restored[q.id] = true; });
      if (Object.keys(restored).length > 0) setDone(restored);
    } catch {}
  }, [doneKey, quests]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist done state whenever it changes
  // useEffect(() => {
  //   try {
  //     const allQ = Object.values(quests).flat();
  //     const doneTitles = allQ.filter((q) => done[q.id]).map((q) => q.title);
  //     localStorage.setItem(doneKey, JSON.stringify(doneTitles));
  //   } catch {}
  // }, [done, quests, doneKey]);

  // ── Quest CRUD ─────────────────────────────────────────────────────────────
  const addQuest = useCallback((sectionId) => {
    setQuests((p) => ({
      ...p,
      [sectionId]: [...(p[sectionId] || []), blankQuest(sectionId)],
    }));
  }, []);

  const updateQuest = useCallback((sectionId, id, field, value) => {
    setQuests((p) => ({
      ...p,
      [sectionId]: p[sectionId].map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  }, []);

  const removeQuest = useCallback((sectionId, id) => {
    setQuests((p) => ({
      ...p,
      [sectionId]: p[sectionId].filter((q) => q.id !== id),
    }));
    setDone((p) => { const n = { ...p }; delete n[id]; return n; });
  }, []);

  const toggleDone = useCallback((id) => {
    setDone((prev) => {
      const nowDone = !prev[id];
      if (nowDone) {
        const quest = Object.values(quests).flat().find((q) => q.id === id);
        if (quest) {
          supabase?.from("quest_logs").insert({
            player:     playerName,
            quest_id:   id,
            xp_earned:  quest.xp || 0,
            date:       new Date().toISOString().slice(0, 10),
          });
        }
      }
      return { ...prev, [id]: nowDone };
    });
  }, [quests, playerName]);

  // ── Load a specific day's presets ───────────────────────────────────────────
  const loadDay = useCallback((dayIdx) => {
    setQuests(buildFromPreset(presetMap, dayIdx));
    setDone({});
  }, [presetMap]);

  const resetDay = useCallback(() => {
    try { localStorage.removeItem(doneKey); } catch {}
    setDone({});
  }, [doneKey]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const allQuests    = Object.values(quests).flat();
  const filledQuests = allQuests.filter((q) => q.title.trim());
  const totalXP      = filledQuests.reduce((s, q) => s + (q.xp || 0), 0);
  const earnedXP     = filledQuests.filter((q) => done[q.id]).reduce((s, q) => s + (q.xp || 0), 0);
  const totalCount   = filledQuests.length;
  const doneCount    = filledQuests.filter((q) => done[q.id]).length;
  const pct          = totalXP > 0 ? Math.round((earnedXP / totalXP) * 100) : 0;

  return {
    quests, done, intention, note,
    setIntention, setNote,
    addQuest, updateQuest, removeQuest, toggleDone,
    loadDay, resetDay,
    totalXP, earnedXP, totalCount, doneCount, pct,
  };
}

// ── useFeed hook ──────────────────────────────────────────────────────────────
export function useFeed() {
  const [posts, setPosts] = useState([]);

  const addPost = useCallback((player, prompt, answer) => {
    if (!answer.trim() || !prompt) return false;
    setPosts((p) => [
      { id: newId(), player, prompt, answer, ts: Date.now() },
      ...p,
    ]);
    return true;
  }, []);

  return { posts, addPost };
}
