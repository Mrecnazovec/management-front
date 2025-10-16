import { PropsWithChildren } from 'react'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'
import { ThemeModal } from '@/components/ui/modals/ThemeModal'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className=''>
			<div className='flex flex-col min-h-screen'>
				<Header />
				<main className='relative flex-1'>{children}</main>
				<ThemeModal />
				<Footer />
			</div>
		</div>
	)
}
