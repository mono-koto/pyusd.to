/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    'react-icons/?(((\\w*)?/?)*)': {
      transform: 'react-icons/{{ matches.[1] }}/{{member}}',
    },
  },
  transpilePackages: ['p5'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.paypalobjects.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
