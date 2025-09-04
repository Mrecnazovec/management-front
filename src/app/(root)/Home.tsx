'use client'

import dynamic from 'next/dynamic'
import CountdownTimer from '@/components/sections/home/CountdownTimer'
import { NavigationSection } from '@/components/sections/home/NavigationSection'
import { NumberSection } from '@/components/sections/home/NumberSection'

const NewsSection = dynamic(() => import('@/components/sections/home/NewsSection'))
const HistorySection = dynamic(() => import('@/components/sections/home/HistorySection'))
const FormModal = dynamic(() => import('@/components/ui/modals/FormModal'))

export function Home() {
	return (
		<>
			<h1 className='sr-only'>Направление Менеджмент ТФ МГУ</h1>
			<NavigationSection />
			<CountdownTimer />
			<NumberSection />
			<HistorySection />
			<NewsSection />
			{/* <FormModal /> */}
		</>
	)
}
