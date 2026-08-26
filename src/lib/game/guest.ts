export const GUEST_MODE_KEY = "orwen-guest-mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GUEST_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function enableGuestMode(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_MODE_KEY, "1");
}

export function clearGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_MODE_KEY);
  } catch {
    /* ignore */
  }
}
