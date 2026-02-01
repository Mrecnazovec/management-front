'use client'

import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import { useGetNewBySlug } from '@/hooks/queries/news/useGetBySlug'
import { NewForm } from '../NewForm'
import { Bread } from '@/components/ui/Breadcrumb/Bread'

export function UpdateNew() {
	const { dataNew } = useGetNewBySlug()

	const navigation = [
		{
			title: 'Главная',
			link: PUBLIC_URL.home(),
		},
		{
			title: 'Админ панель',
			link: ADMIN_URL.home(),
		},
		{
			title: 'Новости',
			link: ADMIN_URL.news(),
		},
		{
			title: dataNew?.title || 'Редактирование новости',
		},
	]
	return (
		<>
			<Bread navigation={navigation} />
			<NewForm post={dataNew} />
		</>
	)
}
