import { Footer } from '@/components/layouts/main-layout/footer/Footer'
import { Header } from '@/components/layouts/main-layout/header/Header'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PATH_URL, PUBLIC_URL } from '@/config/url.config'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Страница в разработке',
	...NO_INDEX_PAGE
}

export default function NotFound() {
	return (
		<>
			<Header />
			<Container className='h-[80vh] flex items-center justify-center flex-col'>
				<Image src={PATH_URL.svg('EconLogoGreen.svg')} alt='Логотип ЭФ МГУ' width={200} height={155} className='mb-4' />
				<p className='text-2xl mb-4 text-center'>Страница находится в разработке</p>
				<Link href={PUBLIC_URL.home()}>
					<Button variant={'main'}>Перейти на главную</Button>
				</Link>
			</Container>
			<Footer />
		</>
	)
}
