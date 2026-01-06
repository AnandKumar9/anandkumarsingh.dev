import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",            // generates /out on `next build` :contentReference[oaicite:0]{index=0}
  images: { unoptimized: true } // required if you use next/image with export :contentReference[oaicite:1]{index=1}
  // optional: trailingSlash: true,
};

export default nextConfig;
