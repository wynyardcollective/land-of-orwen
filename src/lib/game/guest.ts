export const GUEST_MODE_KEY = "rough-guest-mode";
const LEGACY_GUEST_MODE_KEY = "orwen-guest-mode";

function migrateLegacyGuestMode() {
  if (typeof window === "undefined") return;
  if (
    !localStorage.getItem(GUEST_MODE_KEY) &&
    localStorage.getItem(LEGACY_GUEST_MODE_KEY) === "1"
  ) {
    localStorage.setItem(GUEST_MODE_KEY, "1");
    localStorage.removeItem(LEGACY_GUEST_MODE_KEY);
  }
}

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  migrateLegacyGuestMode();
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
