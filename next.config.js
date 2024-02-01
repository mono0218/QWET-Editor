/** @type {import('next').NextConfig} */
require("dotenv").config();
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.output.webassemblyModuleFilename =
      (isServer ? "../" : "") + "static/wasm/[modulehash].wasm";
    return config;
  },
  reactStrictMode: false,
  experimental: { 
    esmExternals: true,
    serverActions: {
      bodySizeLimit: '300mb',
    },
   },
};

module.exports = nextConfig;
