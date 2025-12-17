import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { NewsPage } from './News'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
export const metadata: Metadata = {
	title: 'Новости',
	description:
		'Актуальные новости и события направления Менеджмент Ташкентского филиала МГУ. Узнайте о мероприятиях, достижениях студентов и новых возможностях.',
	keywords: ['новости МГУ', 'новости менеджмент', 'МГУ Ташкент новости'],
}

const navigation = [
	{
		title: 'Главная',
		link: PUBLIC_URL.home(),
	},
	{
		title: 'Университет',
		link: PUBLIC_URL.university(),
	},
	{
		title: 'Новости',
	},
]

export default async function page() {
	'use cache'
	cacheLife({ revalidate: 60 })

	return (
		<>
			<Bread navigation={navigation} />
			<NewsPage />
		</>
	)
}
