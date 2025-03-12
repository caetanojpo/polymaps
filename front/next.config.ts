import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        turbo: {
            // Example: adding an alias and custom file extension
            resolveAlias: {
                underscore: 'lodash',
            },
            resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
        },
    },
};

export default nextConfig;
