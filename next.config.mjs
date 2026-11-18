/** @type {import('next').NextConfig} */
const nextConfig = {
  // The user's home directory also contains a package-lock.json, which is
  // outside this repo. Pinning the root keeps Turbopack scoped to the app.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Avatars are local, first-party placeholder SVGs committed to /public.
    // The CSP keeps them inert if one is ever opened directly in a browser.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
