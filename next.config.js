/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: [
    '@radix-ui/react-slot',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-accordion',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-tabs',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-slider',
    '@radix-ui/react-toast',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-toggle',
    '@radix-ui/react-progress',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-switch',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-separator',
    '@radix-ui/react-tooltip'
  ],
  experimental: {
    esmExternals: 'loose'
  },
  // Skip static optimization for pages with dynamic content
  skipTrailingSlashRedirect: true,
  // Ensure proper handling of client components during build
  swcMinify: true
};

module.exports = nextConfig;