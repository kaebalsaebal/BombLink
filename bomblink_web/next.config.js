/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ]
  },
}

module.exports = nextConfig
