"use client";

/** Tiny Web Audio cues — no external music assets. */
export function playCue(
  enabled: boolean,
  kind: "travel" | "quest" | "reward" | "equip" = "quest",
) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const freqs = {
      travel: [392, 494],
      quest: [330, 440],
      reward: [523, 659, 784],
      equip: [440, 554],
    }[kind];
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqs[0], now);
    freqs.forEach((f, i) => {
      if (i > 0) osc.frequency.setValueAtTime(f, now + i * 0.08);
    });
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.3);
    void ctx.resume();
    setTimeout(() => void ctx.close(), 400);
  } catch {
    // ignore autoplay / unsupported
  }
}
