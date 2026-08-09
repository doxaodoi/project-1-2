/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle for a lean Docker runtime image.
  output: "standalone",
};

export default nextConfig;
