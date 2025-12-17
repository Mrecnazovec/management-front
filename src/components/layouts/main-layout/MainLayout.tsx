import { PropsWithChildren } from 'react'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'
import { ThemeModal } from '@/components/ui/modals/ThemeModal'
import { Suspense } from 'react'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div>
			<div className='flex flex-col min-h-screen'>
				<Suspense fallback={null}>
					<Header />
				</Suspense>
				<main className='relative flex-1 h-full min-h-[500px]'>{children}</main>
				<ThemeModal />
				<Footer />
			</div>
		</div>
	)
}
