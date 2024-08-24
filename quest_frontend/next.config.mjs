/** @type {import('next').NextConfig} */
const nextConfig = {
     productionBrowserSourceMaps: false,
    images: {
        domains: ["pbs.twimg.com", "i.ibb.co","plus.unsplash.com","drive.google.com","s3-alpha-sig.figma.com","lh3.googleusercontent.com"]
    }
};

export default nextConfig;
