/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // Explicit: no trailing slashes (prevents redirect loops with hosting providers)
};

export default nextConfig;
