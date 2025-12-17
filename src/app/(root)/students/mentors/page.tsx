import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { PUBLIC_URL } from '@/config/url.config'
import type { Metadata } from 'next'
import { MentorsPage } from './MentorsPage'
import { cacheLife } from 'next/cache'

export const metadata: Metadata = {
	title: 'Менторы',
	description:
		'Менторы Ташкентского филиала МГУ — это старшие студенты, готовые поддержать первокурсников в адаптации к учебе, поделиться опытом и помочь освоиться в университетской среде. Узнайте больше о наших менторах и их роли в жизни студентов.',
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
			title: 'Менторы',
		},
	]
	return (
		<>
			<Bread navigation={navigation} />
			<MentorsPage />
		</>
	)
}
