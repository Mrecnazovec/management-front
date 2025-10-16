import { ThemeModal } from '@/components/ui/modals/ThemeModal'
import { PropsWithChildren } from 'react'
import { Footer } from './footer/Footer'
import { Header } from './header/Header'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex min-h-screen'>
			<div className='flex-1'>
				<Header />
				<main className='relative h-full'>{children}</main>
				<ThemeModal />
				<Footer />
			</div>
		</div>
	)
}
