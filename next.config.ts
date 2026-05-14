/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
      },
    ],
  },
  // Important: Add this for Firebase Admin SDK
  serverExternalPackages: ['firebase-admin'],
  
  // Optional: Increase API timeout if needed for OpenAI/Gemini calls
  // This is for standalone server, Vercel has its own limits
  staticPageGenerationTimeout: 120,
};

export default nextConfig;