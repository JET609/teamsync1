/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail builds on ESLint warnings/errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail builds on TS errors during initial setup
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
