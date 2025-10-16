import { PropsWithChildren } from 'react'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'
import { ThemeModal } from '@/components/ui/modals/ThemeModal'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='min-h-screen'>
			<div className='flex flex-col flex-1'>
				<Header />
				<main className='relative h-full'>{children}</main>
				<ThemeModal />
				<Footer />
			</div>
		</div>
	)
}
