/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Asegúrate de que Next.js sirva archivos estáticos desde la carpeta 'public'
  images: {
    domains: ['localhost'], // Asegúrate de incluir tu dominio o localhost
  },
};

export default nextConfig;
