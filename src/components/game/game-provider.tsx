"use client";

import {
  addCampfireNote,
  applyRewardedSpeedBoost,
  claimReward,
  canWatchRewardedAd,
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
  startCombat,
  startSkillActivity,
  startRecipeCraft,
  sellMaterial as sellMaterialAction,
  fleeCombat,
  tryLoreGuess,
  unequipSlot,
  upgradeGem,
  writeLocalSave,
  playCue,
  startTavernRound,
  tavernHeal as healAtTavern,
  useConsumable as consumeItem,
  buyShopItem,
  type GameState,
  type Pace,
  type SettingsState,
  type TabId,
  type CombatStance,
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
  isGuest: boolean;
  syncStatus: "idle" | "saving" | "saved" | "offline" | "error" | "guest";
  announcement: string;
  tab: TabId;
  setTab: (tab: TabId) => void;
  travelTo: (locationId: string) => string | null;
  attemptQuest: (questId: string, autoEquip?: boolean) => string | null;
  attemptSkill: (activityId: string) => string | null;
  craftRecipe: (recipeId: string) => string | null;
  sellMaterial: (materialId: string, amount?: number) => string | null;
  engageCombat: (
    encounterId: string,
    stance?: CombatStance | "auto",
  ) => string | null;
  fleeCombat: () => string | null;
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
  buyTavernRound: (tavernId: string) => string | null;
  healAtTavern: (tavernId: string) => string | null;
  buyFromShop: (shopId: string, stockId: string) => string | null;
  useItem: (uid: string) => string | null;
  resetGame: () => void;
  dismissOpening: () => void;
  watchRewardedSpeedBoost: () => Promise<string | null>;
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
  guest = false,
}: {
  children: ReactNode;
  playerId: string;
  heroName: string;
  guest?: boolean;
}) {
  const [state, setState] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<GameContextValue["syncStatus"]>(
    guest ? "guest" : "idle",
  );
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
      const remote = guest ? null : await fetchRemote();
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
        setSyncStatus(guest ? "guest" : "idle");
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [playerId, heroName, guest]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const persist = useCallback(
    (next: GameState) => {
      writeLocalSave(next);
      if (guest) {
        setSyncStatus("guest");
        return;
      }
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSyncStatus("saving");
      saveTimer.current = setTimeout(async () => {
        const ok = await pushRemote(next);
        setSyncStatus(ok ? "saved" : "offline");
      }, 600);
    },
    [guest],
  );

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
      } else if (state.active.type === "tavern" && next.lastTavernResult) {
        const tr = next.lastTavernResult;
        const msg = tr.hit
          ? `${tr.headline} — ${tr.detail}`
          : tr.detail;
        if (lastAnnounced.current !== msg) {
          lastAnnounced.current = msg;
          setAnnouncement(msg);
          playCue(
            state.settings.soundEnabled,
            tr.hit ? "reward" : "ambient",
          );
        }
      } else if (next.pendingReward) {
        const r = next.pendingReward;
        const isCombat = r.kind === "combat";
        const isSkill = r.kind === "skill";
        const msg = isSkill
          ? `${r.activityName ?? "Training"} complete. Rewards ready.`
          : r.tone === "jackpot"
            ? `Jackpot! ${r.narrative}`
            : r.tone === "close-win"
              ? `Close call — ${isCombat ? "fight" : "quest"} done. Rewards ready.`
              : r.tone === "close-loss"
                ? `A hair from right. Rewards ready.`
                : r.success
                  ? isCombat
                    ? "Victory. Rewards ready."
                    : "Quest complete. Rewards ready."
                  : isCombat
                    ? "You were driven back. Scrap rewards ready."
                    : "Quest finished roughly. Rewards ready.";
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

    const naturalPause =
      (!state.pendingReward && next.pendingReward) ||
      (state.active?.type === "travel" && !next.active && !next.pendingReward);
    if (naturalPause) {
      void import("@/lib/mobile/admob").then(({ maybeShowInterstitial }) =>
        maybeShowInterstitial(),
      );
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

  const attemptSkill = useCallback(
    (activityId: string) => {
      if (!state) return "Not ready.";
      const result = startSkillActivity(state, activityId);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("Skill training started.");
      return null;
    },
    [state, update],
  );

  const craftRecipe = useCallback(
    (recipeId: string) => {
      if (!state) return "Not ready.";
      const result = startRecipeCraft(state, recipeId);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("Crafting started.");
      return null;
    },
    [state, update],
  );

  const sellMaterialFn = useCallback(
    (materialId: string, amount = 1) => {
      if (!state) return "Not ready.";
      const result = sellMaterialAction(state, materialId, amount);
      if ("error" in result) return result.error;
      update(() => result);
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

  const engageCombat = useCallback(
    (encounterId: string, stance: CombatStance | "auto" = "auto") => {
      if (!state) return "Not ready.";
      const result = startCombat(state, encounterId, stance);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("Combat joined.");
      return null;
    },
    [state, update],
  );

  const flee = useCallback(() => {
    if (!state) return "Not ready.";
    const result = fleeCombat(state);
    if ("error" in result) return result.error;
    update(() => result);
    setAnnouncement("You disengage.");
    return null;
  }, [state, update]);

  const buyTavernRound = useCallback(
    (tavernId: string) => {
      if (!state) return "Not ready.";
      const result = startTavernRound(state, tavernId);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("Listening for rumors…");
      return null;
    },
    [state, update],
  );

  const healAtTavernFn = useCallback(
    (tavernId: string) => {
      if (!state) return "Not ready.";
      const result = healAtTavern(state, tavernId);
      if ("error" in result) return result.error;
      update(() => result);
      const tr = result.lastTavernResult;
      setAnnouncement(tr?.detail ?? "You recover.");
      playCue(state.settings.soundEnabled, "reward");
      return null;
    },
    [state, update],
  );

  const buyFromShopFn = useCallback(
    (shopId: string, stockId: string) => {
      if (!state) return "Not ready.";
      const result = buyShopItem(state, shopId, stockId);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("Purchase complete.");
      playCue(state.settings.soundEnabled, "reward");
      return null;
    },
    [state, update],
  );

  const useItem = useCallback(
    (uid: string) => {
      if (!state) return "Not ready.";
      const result = consumeItem(state, uid);
      if ("error" in result) return result.error;
      update(() => result);
      setAnnouncement("You use a remedy and feel better.");
      playCue(state.settings.soundEnabled, "reward");
      return null;
    },
    [state, update],
  );

  const value = useMemo<GameContextValue | null>(() => {
    if (!state) return null;
    return {
      state,
      ready,
      isGuest: guest,
      syncStatus,
      announcement,
      tab,
      setTab,
      travelTo,
      attemptQuest,
      attemptSkill,
      craftRecipe,
      sellMaterial: sellMaterialFn,
      engageCombat,
      fleeCombat: flee,
      buyTavernRound,
      healAtTavern: healAtTavernFn,
      buyFromShop: buyFromShopFn,
      useItem,
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
      dismissOpening: () =>
        update((s) => {
          if (s.storyFlags.includes("opening_seen")) return s;
          setAnnouncement("Merrick watches you take the orchard road.");
          return {
            ...s,
            storyFlags: [...s.storyFlags, "opening_seen"],
            updatedAt: Date.now(),
          };
        }),
      watchRewardedSpeedBoost: async () => {
        if (!canWatchRewardedAd(state, Date.now())) {
          const msg = "Rewarded ad is on cooldown. Try again soon.";
          setAnnouncement(msg);
          return msg;
        }
        const { showRewardedSpeedBoostAd } = await import("@/lib/mobile/admob");
        const result = await showRewardedSpeedBoostAd();
        if (!result.ok) {
          setAnnouncement(result.reason);
          return result.reason;
        }
        update((s) => applyRewardedSpeedBoost(s, Date.now()));
        setAnnouncement("2× speed active for 5 minutes.");
        playCue(state.settings.soundEnabled, "reward");
        return null;
      },
      now,
    };
  }, [
    state,
    ready,
    guest,
    syncStatus,
    announcement,
    tab,
    travelTo,
    attemptQuest,
    attemptSkill,
    craftRecipe,
    sellMaterialFn,
    engageCombat,
    flee,
    buyTavernRound,
    healAtTavernFn,
    buyFromShopFn,
    useItem,
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
