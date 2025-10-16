import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SITE_AUTHOR, SITE_NAME } from '@/constants/seo.constants'
import Script from 'next/script'
import { Providers } from './providers'
import { BodyProvider } from '@/components/layouts/main-layout/BodyProvider'

const interSans = Inter({
	variable: '--font-inter-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	authors: SITE_AUTHOR,
	metadataBase: new URL('https://msu-management.uz'),
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-snippet': -1,
			'max-image-preview': 'large',
			'max-video-preview': -1,
		},
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' suppressHydrationWarning className={interSans.variable}>
			<head>
				<meta name='yandex-verification' content='3acc2482785d4638' />

				{/* Yandex Metrika */}
				<Script id='yandex-metrika' strategy='afterInteractive'>
					{`
						(function(m,e,t,r,i,k,a){
							m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
							m[i].l=1*new Date();
							for (var j = 0; j < document.scripts.length; j++) {
								if (document.scripts[j].src === r) return;
							}
							k=e.createElement(t),a=e.getElementsByTagName(t)[0],
							k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
						})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

						ym(102814733, "init", {
							clickmap:true,
							trackLinks:true,
							accurateTrackBounce:true,
							webvisor:true
						});
					`}
				</Script>

				{/* Google Analytics */}
				<Script id='google-analytics' strategy='afterInteractive' src='https://www.googletagmanager.com/gtag/js?id=G-8NGYG03PTG' />
				<Script id='gtag-init' strategy='afterInteractive'>
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-8NGYG03PTG');
					`}
				</Script>
			</head>
			<BodyProvider>
				<Providers>{children}</Providers>
			</BodyProvider>
		</html>
	)
}
