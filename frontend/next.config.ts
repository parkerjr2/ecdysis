import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Allow the Emergent preview hosts to access Next.js dev resources
  // (HMR + on-demand chunks). Without this, hydration fails silently
  // and any framer-motion `initial` styles stay applied → blank pages.
  allowedDevOrigins: [
    "*.preview.emergentagent.com",
    "*.preview.emergentcf.cloud",
    "*.cluster-0.preview.emergentcf.cloud",
    "*.cluster-1.preview.emergentcf.cloud",
    "*.cluster-2.preview.emergentcf.cloud",
    "*.cluster-3.preview.emergentcf.cloud",
    "*.cluster-4.preview.emergentcf.cloud",
    "*.cluster-5.preview.emergentcf.cloud",
    "*.cluster-6.preview.emergentcf.cloud",
    "*.cluster-7.preview.emergentcf.cloud",
    "*.cluster-8.preview.emergentcf.cloud",
    "*.cluster-9.preview.emergentcf.cloud",
    "*.cluster-10.preview.emergentcf.cloud",
    "*.cluster-11.preview.emergentcf.cloud",
    "*.cluster-12.preview.emergentcf.cloud",
    "*.cluster-13.preview.emergentcf.cloud",
    "*.cluster-14.preview.emergentcf.cloud",
    "*.cluster-15.preview.emergentcf.cloud",
    "*.cluster-16.preview.emergentcf.cloud",
    "*.cluster-17.preview.emergentcf.cloud",
    "*.cluster-18.preview.emergentcf.cloud",
    "*.cluster-19.preview.emergentcf.cloud",
    "*.cluster-20.preview.emergentcf.cloud",
    "*.emergentagent.com",
    "*.emergentcf.cloud",
  ],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
