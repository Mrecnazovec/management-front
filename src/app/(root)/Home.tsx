'use client'

import dynamic from 'next/dynamic'
import CountdownTimer from '@/components/sections/home/CountdownTimer'
import { NavigationSection } from '@/components/sections/home/NavigationSection'
import { NumberSection } from '@/components/sections/home/NumberSection'
import AOSComponent from '@/lib/aos'

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
				</div>
			</AOSComponent>
			<CountdownTimer />
			<AOSComponent>
				<div data-aos='fade-up'>
					<NumberSection />
				</div>
			</AOSComponent>
			<AOSComponent>
				<div data-aos='fade-up'>
					<HistorySection />
				</div>
			</AOSComponent>
			<AOSComponent>
				<div data-aos='fade-up'>
					<NewsSection />
				</div>
			</AOSComponent>
			<AOSComponent>
				<div data-aos='fade-up'>
					<BlogSection />
				</div>
			</AOSComponent>
			{/* <FormModal /> */}
		</>
	)
}
