/** @type {import('next').NextConfig} */
const nextConfig = {
  // The user's home directory also contains a package-lock.json, which is
  // outside this repo. Pinning the root keeps Turbopack scoped to the app.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
