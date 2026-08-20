/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Vercel build should still fail on real errors; we keep lint on.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
