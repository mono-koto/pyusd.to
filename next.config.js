/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    'react-icons/?(((\\w*)?/?)*)': {
      transform: 'react-icons/{{ matches.[1] }}/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
