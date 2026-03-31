'use client'

import CountdownTimer from '@/components/sections/home/CountdownTimer'
import { NavigationSection } from '@/components/sections/home/NavigationSection'
import { NumberSection } from '@/components/sections/home/NumberSection'
import AOSComponent from '@/lib/aos'
import dynamic from 'next/dynamic'

const NewsSection = dynamic(() => import('@/components/sections/home/NewsSection'))
const BlogSection = dynamic(() => import('@/components/sections/home/BlogSection'))
const HistorySection = dynamic(() => import('@/components/sections/home/HistorySection'))
const FormModal = dynamic(() => import('@/components/ui/modals/FormModal'))

export function Home() {
	return (
		<>
			<h1 className='sr-only'>Направление Менеджмент ТФ МГУ</h1>
			<AOSComponent>
				<div data-aos='fade-up'>
					<NavigationSection />
					<CountdownTimer />
					<NumberSection />
					<HistorySection />
					<NewsSection />
					<BlogSection />
					{/* <FormModal /> */}
				</div>
			</AOSComponent>
		</>
	)
}
