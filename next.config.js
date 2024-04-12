/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.ignoreWarnings = [{
      module: /typeorm/,
      message: /Module not found|dependency is an expression/,
    }];
    return config;
  }
}

module.exports = nextConfig
