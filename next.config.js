/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ["02x33j77-3000.euw.devtunnels.ms", "localhost:3000"],
        },
    },
};

export default config;
