import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home dir confuses Next's workspace-root inference;
  // pin tracing to this project so font/output tracing resolves correctly.
  outputFileTracingRoot: __dirname,
  // Hide the floating dev badge — it sits bottom-left and overlapped the
  // sidebar user avatar. (Dev-only; has no effect on production.)
  devIndicators: false,
};

export default nextConfig;
