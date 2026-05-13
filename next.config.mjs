/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // Explicit: no trailing slashes (prevents redirect loops with hosting providers)

  async headers() {
    return [
      {
        // Assets statiques nommés — immutables 1 an
        source: '/(logo\\.svg|og-image\\.png|favicon\\.svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Toutes les images, polices et icônes dans /public
        source: '/(.+\\.(?:woff2|woff|ttf|eot|png|jpg|jpeg|webp|gif|ico|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
