import { renderHook, act } from "@testing-library/react";
import { usePlayer } from "../hooks";
import type { QuestType, QuestSection } from "../types";

// Minimal preset map: one quest with known XP on day 0
const PRESET_MAP = {
  0: [{ title: "Test Quest", desc: "desc", xp: 50, type: "growth" as QuestType, section: "morning" as QuestSection }],
  1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
};

describe("usePlayer — earnedXP", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    // Fix today to Sunday (day 0) so PRESET_MAP[0] is always loaded
    jest.setSystemTime(new Date("2026-01-04T10:00:00Z")); // Sunday
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts at 0 earnedXP", () => {
    const { result } = renderHook(() => usePlayer(PRESET_MAP, "test"));
    expect(result.current.earnedXP).toBe(0);
  });

  it("increases earnedXP by the quest's XP when toggleDone is called", () => {
    const { result } = renderHook(() => usePlayer(PRESET_MAP, "test"));

    // Find the quest id assigned at runtime
    const allQuests = Object.values(result.current.quests).flat() as Array<{ id: string; xp: number; title: string }>;
    const quest = allQuests.find((q) => q.title === "Test Quest");
    expect(quest).toBeDefined();

    act(() => {
      result.current.toggleDone(quest!.id);
    });

    expect(result.current.earnedXP).toBe(50);
  });

  it("decreases earnedXP back to 0 when toggleDone is called again (un-complete)", () => {
    const { result } = renderHook(() => usePlayer(PRESET_MAP, "test"));

    const allQuests = Object.values(result.current.quests).flat() as Array<{ id: string; xp: number; title: string }>;
    const quest = allQuests.find((q) => q.title === "Test Quest")!;

    act(() => { result.current.toggleDone(quest.id); });
    expect(result.current.earnedXP).toBe(50);

    act(() => { result.current.toggleDone(quest.id); });
    expect(result.current.earnedXP).toBe(0);
  });

  it("accumulates earnedXP across multiple quests", () => {
    const multiPreset = {
      0: [
        { title: "Quest A", desc: "", xp: 30, type: "work" as QuestType, section: "morning" as QuestSection },
        { title: "Quest B", desc: "", xp: 70, type: "learn" as QuestType, section: "learning" as QuestSection },
      ],
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    };

    const { result } = renderHook(() => usePlayer(multiPreset, "test-multi"));

    const allQuests = Object.values(result.current.quests).flat() as Array<{ id: string; title: string }>;
    const a = allQuests.find((q) => q.title === "Quest A")!;
    const b = allQuests.find((q) => q.title === "Quest B")!;

    act(() => { result.current.toggleDone(a.id); });
    expect(result.current.earnedXP).toBe(30);

    act(() => { result.current.toggleDone(b.id); });
    expect(result.current.earnedXP).toBe(100);
  });
});
