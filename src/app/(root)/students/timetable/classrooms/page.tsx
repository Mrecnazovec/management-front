import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { Suspense } from 'react'
import { ClassRoomsSchedule } from './ClassRoomsSchedule'
import { LoaderSkeleton } from '../LoaderSkeleton'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Расписание аудиторий',
	description:
		'Актуальное расписание аудиторий для студентов направления "Менеджмент" Ташкентского филиала МГУ. Узнайте расписание аудиторий по дням недели и датам.',
	keywords: [
		'Расписание МГУ Ташкент',
		'Расписание аудиторий',
		'ТФ МГУ Менеджмент',
		'Менеджмент МГУ Ташкент',
		'Ташкентский филиал МГУ расписание',
		'Занятия МГУ Ташкент',
		'Расписание пар',
	],
	...NO_INDEX_PAGE
}

export default async function Page() {
	'use cache'
	cacheLife({ revalidate: 60 })
	const navigation = [
		{
			title: 'Главная',
			link: PUBLIC_URL.home(),
		},
		{
			title: 'Студентам',
			link: PUBLIC_URL.students(),
		},
		{
			title: 'Расписание Аудиторий',
		},
	]
	return (
		<>
			<Bread navigation={navigation} />
			<Suspense fallback={<LoaderSkeleton />}>
				<ClassRoomsSchedule />
			</Suspense>
		</>
	)
}
