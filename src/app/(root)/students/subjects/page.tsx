import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Plan } from './Plan'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'

export const metadata: Metadata = {
	title: 'Учебный план',
	description:
		'Актуальный учебный план для студентов направления «Менеджмент» Ташкентского филиала МГУ. Ознакомьтесь со структурой курса и дисциплинами по семестрам.',
}
export default async function page() {
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
			title: 'Предметы',
		},
	]
	return (
		<>
			<Bread navigation={navigation} />
			<Plan />
		</>
	)
}
