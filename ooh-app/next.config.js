/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  env: {
    AUTH0_MGMT_API_ACCESS_TOKEN: process.env.AUTH0_MGMT_API_ACCESS_TOKEN,
    BASE_FETCH_URL: process.env.BASE_FETCH_URL,
    SERVER_FETCH_URL: process.env.SERVER_FETCH_URL
  }
}

module.exports = nextConfig
