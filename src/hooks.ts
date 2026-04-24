import { useState, useEffect, useCallback, useRef } from "react";
import { SECTIONS } from "./data";
import { supabase } from "./supabase";
import type { Quest, FeedPost } from "./types";

// ── Unique ID helper ──────────────────────────────────────────────────────────
export const newId = (): string =>
  `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ── Build a blank quest object ────────────────────────────────────────────────
export const blankQuest = (sectionId = "morning"): Quest => ({
  id:      newId(),
  title:   "",
  desc:    "",
  time:    "",
  xp:      50,
  type:    "growth",
  boss:    false,
  section: sectionId as Quest["section"],
  custom:  true,
});

// ── Build default quests from preset ─────────────────────────────────────────
type QuestPreset = Omit<Quest, "id">;

function buildFromPreset(
  presetMap: Record<number, QuestPreset[]>,
  dayIdx: number
): Record<string, Quest[]> {
  const out: Record<string, Quest[]> = {};
  SECTIONS.forEach(({ id }) => { out[id] = []; });
  (presetMap[dayIdx] || []).forEach((q) => {
    const sec = q.section || "personal";
    out[sec].push({ ...q, id: newId(), custom: false });
  });
  return out;
}

// ── usePlayer return type ─────────────────────────────────────────────────────
export interface UsePlayerReturn {
  quests:       Record<string, Quest[]>;
  done:         Record<string, boolean>;
  intention:    string;
  note:         string;
  selectedDay:  number;
  setIntention: (v: string) => void;
  setNote:      (v: string) => void;
  addQuest:     (sectionId: string) => void;
  updateQuest:  (sectionId: string, id: string, field: keyof Quest, value: Quest[keyof Quest]) => void;
  removeQuest:  (sectionId: string, id: string) => void;
  toggleDone:   (id: string) => void;
  loadDay:      (dayIdx: number) => void;
  resetDay:     () => void;
  totalXP:      number;
  earnedXP:     number;
  totalCount:   number;
  doneCount:    number;
  pct:          number;
}

// ── usePlayer hook ────────────────────────────────────────────────────────────
export function usePlayer(
  presetMap: Record<number, QuestPreset[]>,
  playerName = "unknown"
): UsePlayerReturn {
  const todayIdx  = new Date().getDay();
  const todayDate = new Date().toISOString().slice(0, 10);

  const [selectedDay, setSelectedDay] = useState<number>(todayIdx);
  // Date-based key ensures quests reset each calendar day, not each day-of-week
  const questsKey    = `quests_${playerName}_${todayDate}`;
  const intentionKey = `intention_${playerName}_${todayDate}`;
  const noteKey      = `note_${playerName}_${todayDate}`;
  const doneKey      = `done_${playerName}_${todayDate}`;

  const [quests, setQuests] = useState<Record<string, Quest[]>>(() => {
    try {
      // Try date-based key first (current format)
      const saved = JSON.parse(localStorage.getItem(`quests_${playerName}_${todayDate}`) ?? "null");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) return saved;
      // Migration: fall back to old day-of-week key (today only, to avoid loading stale other-day data)
      const legacy = JSON.parse(localStorage.getItem(`quests_${playerName}_${todayIdx}`) ?? "null");
      if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) return legacy;
    } catch {}
    return buildFromPreset(presetMap, todayIdx);
  });

  const [intention, setIntention] = useState<string>(() => {
    try { return localStorage.getItem(intentionKey) || ""; } catch { return ""; }
  });

  const [note, setNote] = useState<string>(() => {
    try { return localStorage.getItem(noteKey) || ""; } catch { return ""; }
  });

  const [done, setDone] = useState<Record<string, boolean>>({});
  const supabaseLoaded = useRef(false);
  const [supabaseLoadedState, setSupabaseLoadedState] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Supabase load on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("player_day")
      .select("quests, intention, note, done_titles")
      .eq("player", playerName)
      .eq("date", todayDate)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("[QuestApp] load error:", error);
        supabaseLoaded.current = true;
        setSupabaseLoadedState(true);
        if (!data) return;
        const srcQuests: Record<string, Quest[]> | null =
          (data.quests && !Array.isArray(data.quests)) ? data.quests : null;
        if (srcQuests) {
          setQuests(srcQuests);
          try { localStorage.setItem(questsKey, JSON.stringify(srcQuests)); } catch {}
        }
        if (data.intention != null) {
          setIntention(data.intention);
          try { localStorage.setItem(intentionKey, data.intention); } catch {}
        }
        if (data.note != null) {
          setNote(data.note);
          try { localStorage.setItem(noteKey, data.note); } catch {}
        }
        if (Array.isArray(data.done_titles) && data.done_titles.length > 0) {
          const allQ = Object.values(srcQuests || quests).flat();
          const restored: Record<string, boolean> = {};
          allQ.forEach((q) => { if (data.done_titles.includes(q.title)) restored[q.id] = true; });
          setDone(restored);
          try { localStorage.setItem(doneKey, JSON.stringify(data.done_titles)); } catch {}
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save done immediately to localStorage + Supabase ───────────────────────
  useEffect(() => {
    if (!supabaseLoaded.current) return;
    const allQ = Object.values(quests).flat();
    const doneTitles = allQ.filter((q) => done[q.id]).map((q) => q.title);
    try { localStorage.setItem(doneKey, JSON.stringify(doneTitles)); } catch {}
    if (!supabase) return;
    supabase.from("player_day")
      .upsert(
        { player: playerName, date: todayDate, quests, intention, note, done_titles: doneTitles },
        { onConflict: "player,date" }
      )
      .then(({ error }) => { if (error) console.error("[QuestApp] done save error:", error); });
  }, [done, supabaseLoadedState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounce-save quests/intention/note to localStorage + Supabase ──────────
  useEffect(() => {
    // Only persist when playing today — browsing other-day presets in Edit must not overwrite today's data
    if (selectedDay === todayIdx) {
      try {
        localStorage.setItem(questsKey, JSON.stringify(quests));
        localStorage.setItem(intentionKey, intention);
        localStorage.setItem(noteKey, note);
      } catch {}
    }
    // Only sync today's data to Supabase — never overwrite today's remote row
    // with a different day's quests that the user is just browsing.
    if (!supabase || !supabaseLoaded.current || selectedDay !== todayIdx) return;
    const allQ = Object.values(quests).flat();
    const doneTitles = allQ.filter((q) => done[q.id]).map((q) => q.title);
    clearTimeout(saveTimer.current ?? undefined);
    saveTimer.current = setTimeout(() => {
      supabase!.from("player_day")
        .upsert(
          { player: playerName, date: todayDate, quests, intention, note, done_titles: doneTitles },
          { onConflict: "player,date" }
        )
        .then(({ error }) => { if (error) console.error("[QuestApp] text save error:", error); });
    }, 1500);
  }, [quests, intention, note]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restore done from localStorage before Supabase loads ───────────────────
  useEffect(() => {
    if (supabaseLoaded.current) return;
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(doneKey) || "[]");
      if (!Array.isArray(saved) || saved.length === 0) return;
      const allQ = Object.values(quests).flat();
      const restored: Record<string, boolean> = {};
      allQ.forEach((q) => { if (saved.includes(q.title)) restored[q.id] = true; });
      if (Object.keys(restored).length > 0) setDone(restored);
    } catch {}
  }, [doneKey, quests]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Quest CRUD ─────────────────────────────────────────────────────────────
  const addQuest = useCallback((sectionId: string): void => {
    setQuests((p) => ({
      ...p,
      [sectionId]: [...(p[sectionId] || []), blankQuest(sectionId)],
    }));
  }, []);

  const updateQuest = useCallback((
    sectionId: string,
    id: string,
    field: keyof Quest,
    value: Quest[keyof Quest]
  ): void => {
    setQuests((p) => ({
      ...p,
      [sectionId]: p[sectionId].map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  }, []);

  const removeQuest = useCallback((sectionId: string, id: string): void => {
    setQuests((p) => ({
      ...p,
      [sectionId]: p[sectionId].filter((q) => q.id !== id),
    }));
    setDone((p) => { const n = { ...p }; delete n[id]; return n; });
  }, []);

  const toggleDone = useCallback((id: string): void => {
    setDone((prev) => {
      const nowDone = !prev[id];
      if (nowDone) {
        const quest = Object.values(quests).flat().find((q) => q.id === id);
        if (quest) {
          supabase?.from("quest_logs").insert({
            player:    playerName,
            quest_id:  id,
            xp_earned: quest.xp || 0,
            date:      new Date().toISOString().slice(0, 10),
          });
        }
      }
      return { ...prev, [id]: nowDone };
    });
  }, [quests, playerName]);

  const loadDay = useCallback((dayIdx: number): void => {
    if (dayIdx === todayIdx) {
      // Load today's actual saved board (date-based key)
      let saved: Record<string, Quest[]> | null = null;
      try {
        const raw = localStorage.getItem(`quests_${playerName}_${todayDate}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) saved = parsed;
        }
      } catch {}
      setQuests(saved ?? buildFromPreset(presetMap, dayIdx));
    } else {
      // For other days always use the preset — no stale cross-week localStorage data
      setQuests(buildFromPreset(presetMap, dayIdx));
    }
    setDone({});
    setSelectedDay(dayIdx);
  }, [presetMap, playerName, todayDate, todayIdx]);

  const resetDay = useCallback((): void => {
    try {
      localStorage.removeItem(doneKey);
      localStorage.removeItem(questsKey);
    } catch {}
    setDone({});
    setQuests(buildFromPreset(presetMap, todayIdx));
    setSelectedDay(todayIdx);
  }, [doneKey, questsKey, presetMap, todayIdx]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const allQuests    = Object.values(quests).flat();
  const filledQuests = allQuests.filter((q) => q.title.trim());
  const totalXP      = filledQuests.reduce((s, q) => s + (q.xp || 0), 0);
  const earnedXP     = filledQuests.filter((q) => done[q.id]).reduce((s, q) => s + (q.xp || 0), 0);
  const totalCount   = filledQuests.length;
  const doneCount    = filledQuests.filter((q) => done[q.id]).length;
  const pct          = totalXP > 0 ? Math.round((earnedXP / totalXP) * 100) : 0;

  return {
    quests, done, intention, note, selectedDay,
    setIntention, setNote,
    addQuest, updateQuest, removeQuest, toggleDone,
    loadDay, resetDay,
    totalXP, earnedXP, totalCount, doneCount, pct,
  };
}

// ── useFeed return type ───────────────────────────────────────────────────────
export interface UseFeedReturn {
  posts:       FeedPost[];
  feedLoading: boolean;
  addPost:     (player: string, prompt: string, answer: string) => Promise<boolean>;
}

// ── useFeed hook ──────────────────────────────────────────────────────────────
export function useFeed(): UseFeedReturn {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!supabase) { setFeedLoading(false); return; }
    supabase
      .from("feed_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) console.error("[QuestApp] feed load error:", error);
        if (data) setPosts(data as FeedPost[]);
        setFeedLoading(false);
      });
  }, []);

  const addPost = useCallback(async (
    player: string,
    prompt: string,
    answer: string
  ): Promise<boolean> => {
    if (!answer.trim() || !prompt) return false;
    const newPost: FeedPost = {
      id: newId(),
      player,
      prompt,
      answer,
      created_at: new Date().toISOString(),
    };
    setPosts((p) => [newPost, ...p]);
    if (supabase) {
      const { error } = await supabase.from("feed_posts").insert(newPost);
      if (error) console.error("[QuestApp] feed post error:", error);
    }
    return true;
  }, []);

  return { posts, feedLoading, addPost };
}
