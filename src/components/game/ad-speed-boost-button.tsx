"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  canWatchRewardedAd,
  isSpeedBoostActive,
  rewardCooldownRemainingMs,
  speedBoostRemainingMs,
} from "@/lib/game";
import { useGame } from "./game-provider";

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function AdSpeedBoostButton() {
  const { state, now, watchRewardedSpeedBoost } = useGame();
  const [native, setNative] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void import("@capacitor/core").then(({ Capacitor }) => {
      setNative(
        Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android",
      );
    });
  }, []);

  if (!native) return null;

  const boostActive = isSpeedBoostActive(state, now);
  const canWatch = canWatchRewardedAd(state, now);
  const boostLeft = speedBoostRemainingMs(state, now);
  const cooldownLeft = rewardCooldownRemainingMs(state, now);

  let label = "Watch ad · 5 min speed boost";
  if (loading) {
    label = "Loading ad…";
  } else if (boostActive) {
    label = `2× speed · ${formatCountdown(boostLeft)}`;
  } else if (!canWatch) {
    label = `Cooldown · ${formatCountdown(cooldownLeft)}`;
  }

  return (
    <Button
      type="button"
      variant={boostActive ? "default" : "outline"}
      size="sm"
      className="h-8 shrink-0 text-xs"
      disabled={loading || boostActive || !canWatch}
      onClick={async () => {
        setLoading(true);
        try {
          await watchRewardedSpeedBoost();
        } finally {
          setLoading(false);
        }
      }}
    >
      {label}
    </Button>
  );
}
