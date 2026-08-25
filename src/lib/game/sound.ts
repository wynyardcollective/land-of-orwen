/** Tiny Web Audio cues — no external music assets. */
export function playCue(
  enabled: boolean,
  kind: "travel" | "quest" | "reward" | "equip" | "ambient" = "quest",
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
    const t = ctx.currentTime;
    const freqs = {
      travel: [392, 494],
      quest: [330, 440],
      reward: [523, 659, 784],
      equip: [440, 554],
      ambient: [196, 247],
    }[kind];
    osc.type = kind === "ambient" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freqs[0], t);
    freqs.forEach((f, i) => {
      if (i > 0) osc.frequency.setValueAtTime(f, t + i * 0.08);
    });
    const peak = kind === "ambient" ? 0.03 : 0.08;
    const dur = kind === "ambient" ? 0.9 : 0.28;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.05);
    void ctx.resume();
    setTimeout(() => void ctx.close(), (dur + 0.2) * 1000);
  } catch {
    // ignore autoplay / unsupported
  }
}
