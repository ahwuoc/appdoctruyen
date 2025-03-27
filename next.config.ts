/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
});

const nextConfig = {
  images: {
    domains: ["cmangax.com", "hlafeihngnjueskyjfmh.supabase.co"],
  },
};

export default pwaConfig(nextConfig);
