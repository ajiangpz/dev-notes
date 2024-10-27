/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs)$/,
            use: "raw-loader"
        })
        return config
    }
};

export default nextConfig;
