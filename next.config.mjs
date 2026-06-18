/**
 * Defense-in-depth response headers applied to every route.
 *
 * Note on CSP: the site is fully static (SSG) and Next injects inline bootstrap
 * scripts (RSC payload) plus our pre-paint theme script, so `script-src` allows
 * 'unsafe-inline'. A nonce-based CSP would force dynamic rendering and is
 * unnecessary here — there is no user input and no untrusted HTML is rendered.
 * The remaining directives still add meaningful hardening (object-src, base-uri,
 * frame-ancestors, connect/img/font restrictions).
 */
// Next.js dev mode relies on eval() for HMR, so 'unsafe-eval' is allowed in
// development only. Production builds do not use eval and stay strict.
const isDev = process.env.NODE_ENV !== 'production';
const scriptSrc = `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  "connect-src 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Sample cover art and in-article illustrations ship as local SVGs.
    // SVGs are served from our own /public dir only, sandboxed by the CSP below.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
