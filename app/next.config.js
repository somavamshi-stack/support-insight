/**
 * @type {import('next').NextConfig}
 */

// Default environment variables with fallback values
const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL || "";
const TOPIC_API_URL = process.env.TOPIC_API_URL || "";
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || "";
const PLAUSIBLE_DOMAIN = process.env.PLAUSIBLE_DOMAIN || "";
const ADMIN_AGENT = process.env.ADMIN_AGENT || "";
const ADMIN_FLOW_DASHBOARD_API = process.env.ADMIN_FLOW_DASHBOARD_API || "";
/**
 * * Next.js configuration object
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    productionBrowserSourceMaps: false, // Disable source maps in development
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: {
        DASHBOARD_API_URL,
        TOPIC_API_URL,
        AUTH_DOMAIN,
        PLAUSIBLE_DOMAIN,
        ADMIN_AGENT,
        ADMIN_FLOW_DASHBOARD_API
    },
    // experimental: { webpackMemoryOptimizations: true },
    generateEtags: false,
    compress: false,
    poweredByHeader: false,
    // Enable React strict mode for better debugging
    // reactStrictMode: true,

    // Optional: Uncomment to change the output directory
    // distDir: 'dist',

    // Optional: Uncomment to add trailing slashes to URLs
    // trailingSlash: true,

    // Rewrites for custom API routes and assets
    async rewrites() {
        return [
            {
                source: "/documentation/:path*",
                destination: "http://localhost:9001/documentation/:path*"
            },
            {
                source: "/assets/analytics.js",
                destination: `${PLAUSIBLE_DOMAIN}/js/plausible.local.manual.js`
            },
            {
                source: "/api/event",
                destination: `${PLAUSIBLE_DOMAIN}/api/event`
            },
            {
                source: "/api/v1/dashboard/:path*",
                destination: `${DASHBOARD_API_URL}/api/v1/dashboard/:path*`
            },
            {
                source: "/api/v1/topics/:path*",
                destination: `${TOPIC_API_URL}/api/v1/topics/:path*`
            },
            {
                source: "/api/auth/:path*",
                destination: `${AUTH_DOMAIN}/api/auth/:path*`
            },
            {
                source: "/api/auth/validate-session",
                destination: `${AUTH_DOMAIN}/api/auth/validate-session/`
            },
            {
                source: "/api/threads/:path*",
                destination: `${ADMIN_AGENT}/threads/:path*`
            },
            {
                source: "/api/v1/create-dashboards",
                destination: `${ADMIN_FLOW_DASHBOARD_API}/dashboards/`
            },

            {
                source: "/api/v1/get-dashboards",
                destination: `${ADMIN_FLOW_DASHBOARD_API}/dashboards/?include_items=false`
            },
            {
                source: "/api/v1/dashboards/:path*",
                destination: `${ADMIN_FLOW_DASHBOARD_API}/dashboards/:path*`
            },
            {
                source: "/api/v1/get-monitoring-configs",
                destination: `${ADMIN_FLOW_DASHBOARD_API}/monitoring/configs/`
            },
            {
                source: "/api/v1/monitoring-configs/:path*",
                destination: `${ADMIN_FLOW_DASHBOARD_API}/monitoring/configs/:path*`
            }
        ];
    }
};

module.exports = nextConfig;
