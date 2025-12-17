import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Enable Cache Components (Next.js 16) to cache server component trees and support partial prerendering
	cacheComponents: true,
	env: {
		APP_ENV: process.env.APP_ENV,
		APP_URL: process.env.APP_URL,
		APP_DOMAIN: process.env.APP_DOMAIN,
		SERVER_URL: process.env.SERVER_URL,
		CHAT_ID: process.env.CHAT_ID,
		TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'storage.yandexcloud.net',
			},
		],
	},
	async rewrites() {
		return [{ source: '/uploads/:path*', destination: `${process.env.SERVER_URL}/uploads/:path*` }]
	},
}

export default nextConfig
