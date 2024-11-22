/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clusterprotocol2024.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    AMPLIFY_DIFF_DEPLOY: false,
    AMPLIFY_MONOREPO_APP_ROOT: "quest_frontend",
    NEXT_PUBLIC_CLIENT_URL: "https://www.famprotocol.org",
    NEXT_PUBLIC_CONTRACT_ADDRESS: "0x29D791d0C8f119643e2c087B3210586095370A03",
    NEXT_PUBLIC_DISCORD_ID: "1281573827570176122",
    NEXT_PUBLIC_ENABLE_TESTNETS: true,
    NEXT_PUBLIC_ETHERSCAN_API_KEY: "BY6ZZV9PHW8F8CDZZEH99I5YE21IGUWQWF",
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyCEtfSArKGNNfi2hR2EghXXi2ZWNYOxafE",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:920316322961:web:d869cc3b73dc20188b4b30",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "famprotocol-6ad26.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-Y8WFQJBE5T",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "920316322961",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "famprotocol-6ad26",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "famprotocol-6ad26.appspot.com",
    NEXT_PUBLIC_GC_API_KEY: "0r3rUoZE.jo66BatK97s8VxmWlrzoctaEyr41lQm2",
    NEXT_PUBLIC_GC_SCORER_ID: 7774,
    NEXT_PUBLIC_RAINBOW_PROJECT_ID: "3ee74b26b11b7a95cba6232d62a98a44",
    NEXT_PUBLIC_S3_BUCKET_NAME: "clusterprotocol2024",
    NEXT_PUBLIC_SERVER_URL: "http://localhost:8000",
    // NEXT_PUBLIC_SERVER_URL: "https://server.famprotocol.org",

    //Mainnet
    // NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS:
    //   "0x74410961dc2007425E7Ab96B5c022cC2BC4AE53f",

    //Testnet
    NEXT_PUBLIC_UPGRADABLECONTRACT_ADDRESS:
      "0xDbc0BAa4ecb73FD6f7EE0eA553fb3CE92402E30B",

    NEXT_PUBLIC_USDT_CONTRACT_ADDRESS:
      "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  },
};

export default nextConfig;
