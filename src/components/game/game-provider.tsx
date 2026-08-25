"use client";

import {
  addCampfireNote,
  claimReward,
  createInitialState,
  equipItem,
  loadLocalSave,
  normalizeState,
  renameHero,
  resetLoreGuesses,
  resolveCompletedActions,
  sellItem,
  socketGem,
  startQuest,
  startTravel,
  tryLoreGuess,
  unequipSlot,
  upgradeGem,
  writeLocalSave,
  playCue,
  type GameState,
  type Pace,
  type SettingsState,
  type TabId,
} from "@/lib/game";
import { ARRIVAL_LINES } from "@/content";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface GameContextValue {
  state: GameState;
  ready: boolean;
  syncStatus: "idle" | "saving" | "saved" | "offline" | "error";
  announcement: string;
  tab: TabId;
  setTab: (tab: TabId) => void;
  travelTo: (locationId: string) => string | null;
  attemptQuest: (questId: string, autoEquip?: boolean) => string | null;
  claim: () => void;
  equip: (uid: string) => void;
  unequip: (slot: keyof GameState["equipment"]) => void;
  sell: (uid: string) => void;
  upgrade: (gemUid: string) => string | null;
  socket: (itemUid: string, gemUid: string) => string | null;
  loreGuess: (symbols: string[]) => string | null;
  resetLore: () => void;
  postNote: (body: string) => void;
  setName: (name: string) => void;
  patchSettings: (patch: Partial<SettingsState>) => void;
  resetGame: () => void;
  now: number;
}

const GameContext = createContext<GameContextValue | null>(null);

async function fetchRemote(): Promise<GameState | null> {
  try {
    const res = await fetch("/api/save", { credentials: "include" });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as { state: GameState | null };
    return data.state;
  } catch {
    return null;
  }
}

async function pushRemote(state: GameState): Promise<boolean> {
  try {
    const res = await fetch("/api/save", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function GameProvider({
  children,
  playerId,
  heroName,
}: {
  children: ReactNode;
  playerId: string;
  heroName: string;
}) {
  const [state, setState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<GameContextValue["syncStatus"]>("idle");
  const [announcement, setAnnouncement] = useState("");
  const [tab, setTab] = useState<TabId>("map");
  const [now, setNow] = useState(() => Date.now());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnnounced = useRef<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const localRaw = loadLocalSave();
      const local =
        localRaw && localRaw.playerId === playerId ? localRaw : null;
      const remote = await fetchRemote();
      let initial: GameState;
      if (remote && local) {
        initial = remote.updatedAt >= local.updatedAt ? remote : local;
      } else {
        initial =
          remote ?? local ?? createInitialState(playerId, heroName);
      }
      initial = { ...initial, playerId };
      if (!initial.heroName?.trim()) {
        initial = { ...initial, heroName };
      }
      initial = normalizeState(initial);
      initial = resolveCompletedActions(initial);
      if (!cancelled) {
        setState(initial);
        writeLocalSave(initial);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [playerId, heroName]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const persist = useCallback((next: GameState) => {
    writeLocalSave(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const ok = await pushRemote(next);
      setSyncStatus(ok ? "saved" : "offline");
    }, 600);
  }, []);

  useEffect(() => {
    if (!state) return;
    const next = resolveCompletedActions(state, Date.now());
    if (next === state) return;
    if (state.active && !next.active) {
      if (state.active.type === "travel") {
        const dest = state.active.toLocationId;
        const msg =
          ARRIVAL_LINES[dest] ?? `Travel complete. You arrive safely.`;
        if (lastAnnounced.current !== msg) {
          lastAnnounced.current = msg;
          setAnnouncement(msg);
          playCue(state.settings.soundEnabled, "travel");
        }
      } else if (next.pendingReward) {
        const r = next.pendingReward;
        const msg =
          r.tone === "jackpot"
            ? `Jackpot! ${r.narrative}`
            : r.tone === "close-win"
              ? `Close call — you made it. Rewards ready.`
              : r.tone === "close-loss"
                ? `A hair from right. Rewards ready.`
                : r.success
                  ? `Quest complete. Rewards ready.`
                  : `Quest finished roughly. Rewards ready.`;
        if (lastAnnounced.current !== msg) {
          lastAnnounced.current = msg;
          setAnnouncement(msg);
          playCue(
            state.settings.soundEnabled,
            r.tone === "jackpot" ? "equip" : "reward",
          );
        }
      }
    }
    setState(next);
    persist(next);
  }, [now, state, persist]);

  const update = useCallback(
    (updater: (s: GameState) => GameState) => {
      setState((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const travelTo = useCallback(
    (locationId: string) => {
      if (!state) return "Not ready.";
      const result = startTravel(state, locationId);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement(`Traveling…`);
      return null;
    },
    [state, update],
  );

  const attemptQuest = useCallback(
    (questId: string, autoEquip = false) => {
      if (!state) return "Not ready.";
      const result = startQuest(state, questId, autoEquip);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement(`Quest started.`);
      return null;
    },
    [state, update],
  );

  const value = useMemo<GameContextValue | null>(() => {
    if (!state) return null;
    return {
      state,
      ready,
      syncStatus,
      announcement,
      tab,
      setTab,
      travelTo,
      attemptQuest,
      claim: () =>
        update((s) => {
          const next = claimReward(s);
          setAnnouncement(
            next.pendingReward ? "" : "Rewards claimed.",
          );
          return next;
        }),
      equip: (uid) => update((s) => equipItem(s, uid)),
      unequip: (slot) => update((s) => unequipSlot(s, slot)),
      sell: (uid) => update((s) => sellItem(s, uid)),
      upgrade: (gemUid) => {
        const result = upgradeGem(state, gemUid);
        if ("error" in result) return result.error;
        update(() => result);
        return null;
      },
      socket: (itemUid, gemUid) => {
        const result = socketGem(state, itemUid, gemUid);
        if ("error" in result) return result.error;
        update(() => result);
        return null;
      },
      loreGuess: (symbols) => {
        const result = tryLoreGuess(state, symbols);
        if ("error" in result) return result.error;
        update(() => result);
        setAnnouncement(
          result.loreSolved
            ? "Lore solved! The shrine gate can open."
            : `Incorrect order. ${result.loreGuessesLeft} guesses left.`,
        );
        return result.loreSolved ? null : "Incorrect.";
      },
      resetLore: () => update((s) => resetLoreGuesses(s)),
      postNote: (body) => {
        if (!body.trim()) return;
        update((s) => addCampfireNote(s, body));
      },
      setName: (name) => update((s) => renameHero(s, name)),
      patchSettings: (patch) =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, ...patch },
          updatedAt: Date.now(),
        })),
      resetGame: () => {
        const fresh = createInitialState(playerId, state.heroName);
        setState(fresh);
        persist(fresh);
        setAnnouncement("New journey begun.");
        setTab("map");
      },
      now,
    };
  }, [
    state,
    ready,
    syncStatus,
    announcement,
    tab,
    travelTo,
    attemptQuest,
    update,
    persist,
    now,
    playerId,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
        <p role="status">Loading your journey…</p>
      </div>
    );
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function paceLabel(pace: Pace) {
  switch (pace) {
    case "swift":
      return "Swift (demo)";
    case "balanced":
      return "Balanced";
    case "classic":
      return "Classic";
  }
}
