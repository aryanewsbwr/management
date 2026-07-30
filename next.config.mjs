/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Allows static export for Capacitor mobile & Electron packaging if needed
  output: undefined,
};

export default nextConfig;
