/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@opvi/domain", "@opvi/core"],
};

module.exports = nextConfig;
