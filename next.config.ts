
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from the Studio editor.
    allowedDevOrigins: [
      '*.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev',
    ],
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'iili.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
