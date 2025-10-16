import { PropsWithChildren } from 'react'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'
import { ThemeModal } from '@/components/ui/modals/ThemeModal'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex min-h-screen'>
			<div className='flex-1'>
				<Header />
				<main className='relative flex-1'>{children}</main>
				<ThemeModal />
				<Footer />
			</div>
		</div>
	)
}
