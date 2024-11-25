/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['onwardstate.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/news',
        destination: 'https://onwardstate.com/feed/',
      },
    ]
  },
}

module.exports = nextConfig

