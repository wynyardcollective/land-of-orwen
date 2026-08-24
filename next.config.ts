import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // OpenNext on Workers
};

export default nextConfig;

// Enable Cloudflare bindings during `next dev` when available
initOpenNextCloudflareForDev();
