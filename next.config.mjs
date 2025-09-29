console.log("Loading Next.js config with offline AMP assets")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    amp: {
      skipValidation: false,
    },
  },
}

export default nextConfig
