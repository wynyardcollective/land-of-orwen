import { cookies, headers } from "next/headers";

const APP_COOKIE = "orwen_client";
const APP_VALUE = "android-app";
const APP_HEADER = "x-orwen-client";

/**
 * AdSense is for the public website only — not loaded in the Android app wrapper
 * (Google Play / AdSense policies for WebView-packaged apps).
 */
export async function AdSenseScript() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  if (
    headerStore.get(APP_HEADER) === APP_VALUE ||
    cookieStore.get(APP_COOKIE)?.value === APP_VALUE
  ) {
    return null;
  }

  return (
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8224711942994508"
      crossOrigin="anonymous"
    />
  );
}
