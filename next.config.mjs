/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Storybook iframe を許可するための CSP は開発環境では不要
  // 本番環境では適切に設定すること
};

export default nextConfig;
