import { useState, useCallback } from "react";
import { JOE_QUESTS, LIZ_QUESTS, SECTIONS } from "./data";

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
const hydratePresets = (presetMap) => {
  const out = {};
  SECTIONS.forEach(({ id }) => { out[id] = []; });
  Object.entries(presetMap).forEach(([dayIdx, quests]) => {
    quests.forEach((q) => {
      const sec = q.section || "personal";
      if (!out[sec]) out[sec] = [];
      out[sec].push({ ...q, id: newId(), custom: false, day: Number(dayIdx) });
    });
  });
  return out;
};

// ── usePlayer hook ────────────────────────────────────────────────────────────
// Manages one player's quests, done state, and template editing.
export function usePlayer(presetMap) {
  const todayIdx = new Date().getDay();

  // Quests keyed by section: { morning:[], work:[], learning:[], personal:[], closing:[] }
  const [quests, setQuests] = useState(() => {
    const out = {};
    SECTIONS.forEach(({ id }) => { out[id] = []; });
    const dayQ = presetMap[todayIdx] || [];
    dayQ.forEach((q) => {
      const sec = q.section || "personal";
      out[sec].push({ ...q, id: newId(), custom: false });
    });
    return out;
  });

  const [done, setDone] = useState({});

  // ── Quest CRUD ──────────────────────────────────────────────────────────────
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
    setDone((p) => ({ ...p, [id]: !p[id] }));
  }, []);

  // ── Load a specific day's presets ───────────────────────────────────────────
  const loadDay = useCallback((dayIdx) => {
    const out = {};
    SECTIONS.forEach(({ id }) => { out[id] = []; });
    const dayQ = presetMap[dayIdx] || [];
    dayQ.forEach((q) => {
      const sec = q.section || "personal";
      out[sec].push({ ...q, id: newId(), custom: false });
    });
    setQuests(out);
    setDone({});
  }, [presetMap]);

  const resetDay = useCallback(() => {
    setDone({});
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const allQuests     = Object.values(quests).flat();
  const filledQuests  = allQuests.filter((q) => q.title.trim());
  const totalXP       = filledQuests.reduce((s, q) => s + (q.xp || 0), 0);
  const earnedXP      = filledQuests.filter((q) => done[q.id]).reduce((s, q) => s + (q.xp || 0), 0);
  const totalCount    = filledQuests.length;
  const doneCount     = filledQuests.filter((q) => done[q.id]).length;
  const pct           = totalXP > 0 ? Math.round((earnedXP / totalXP) * 100) : 0;

  return {
    quests, done,
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
