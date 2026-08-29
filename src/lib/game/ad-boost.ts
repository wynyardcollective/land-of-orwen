import type { GameState, MobileAdsState } from "./types";

/** Timers run at 2× speed while boost is active */
export const AD_SPEED_MULTIPLIER = 2;
export const AD_SPEED_DURATION_MS = 5 * 60 * 1000;
export const AD_REWARD_COOLDOWN_MS = 10 * 60 * 1000;

export function emptyMobileAds(): MobileAdsState {
  return { speedBoostUntil: null, rewardCooldownUntil: null };
}

export function normalizeMobileAds(raw: GameState["mobileAds"]): MobileAdsState {
  if (!raw) return emptyMobileAds();
  return {
    speedBoostUntil: raw.speedBoostUntil ?? null,
    rewardCooldownUntil: raw.rewardCooldownUntil ?? null,
  };
}

export function isSpeedBoostActive(state: GameState, now = Date.now()): boolean {
  return (state.mobileAds?.speedBoostUntil ?? 0) > now;
}

export function adSpeedFactor(state: GameState, now = Date.now()): number {
  return isSpeedBoostActive(state, now) ? AD_SPEED_MULTIPLIER : 1;
}

export function canWatchRewardedAd(state: GameState, now = Date.now()): boolean {
  const until = state.mobileAds?.rewardCooldownUntil;
  return !until || until <= now;
}

export function rewardCooldownRemainingMs(
  state: GameState,
  now = Date.now(),
): number {
  const until = state.mobileAds?.rewardCooldownUntil;
  if (!until || until <= now) return 0;
  return until - now;
}

export function speedBoostRemainingMs(state: GameState, now = Date.now()): number {
  const until = state.mobileAds?.speedBoostUntil;
  if (!until || until <= now) return 0;
  return until - now;
}

function shrinkEndTime(endsAt: number, now: number, factor: number): number {
  if (endsAt <= now) return endsAt;
  return now + Math.max(500, Math.round((endsAt - now) / factor));
}

/** Compress in-progress timers when a speed boost starts */
export function compressActiveTimers(
  state: GameState,
  now: number,
  factor = AD_SPEED_MULTIPLIER,
): GameState {
  if (!state.active || factor <= 1) return state;

  const active = state.active;
  if (active.type === "combat") {
    if (active.nextRoundAt <= now) return state;
    return {
      ...state,
      active: {
        ...active,
        nextRoundAt: shrinkEndTime(active.nextRoundAt, now, factor),
      },
    };
  }

  if ("completesAt" in active && active.completesAt > now) {
    return {
      ...state,
      active: {
        ...active,
        completesAt: shrinkEndTime(active.completesAt, now, factor),
      },
    };
  }

  return state;
}

export function applyRewardedSpeedBoost(
  state: GameState,
  now = Date.now(),
): GameState {
  if (!canWatchRewardedAd(state, now)) return state;

  let next: GameState = {
    ...state,
    mobileAds: {
      speedBoostUntil: now + AD_SPEED_DURATION_MS,
      rewardCooldownUntil: now + AD_REWARD_COOLDOWN_MS,
    },
    updatedAt: now,
  };

  next = compressActiveTimers(next, now);
  return next;
}
