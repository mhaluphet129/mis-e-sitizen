/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    mongodb: {
      ip: process.env.MONGODB_IP,
      port: process.env.MONGODB_PORT,
      db: process.env.MONGODB_STAGING_DB_NAME,
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
      clusterUrl: process.env.MONGODB_STAGING_CLUSTER_URL,
    },
  },
};

module.exports = nextConfig;
