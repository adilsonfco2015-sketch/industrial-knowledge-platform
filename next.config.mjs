/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  distDir: process.env.NODE_ENV === 'production' ? '.next-production' : '.next',
};

export default nextConfig;
