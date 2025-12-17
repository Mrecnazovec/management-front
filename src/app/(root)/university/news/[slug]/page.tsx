import { Metadata, ResolvingMetadata } from 'next'
import { cacheLife } from 'next/cache'
import { SingleNews } from './SingleNews'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { newService } from '@/services/new.service'
import { notFound } from 'next/navigation'
import { stripHtml } from '@/lib/generateDescription'

export async function generateStaticParams() {
	const posts = await newService.getAll()

	return posts.map((post) => ({
		slug: post.slug,
	}))
}

async function getNew(slug: string) {
	try {
		return await newService.getBySlug(slug)
	} catch {
		notFound()
	}
}

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	'use cache'
	cacheLife({ revalidate: 60 })

	const post = await getNew((await params).slug)

	return {
		title: post.title,
		description: stripHtml(post.text),
	}
}

export default async function Page({ params }: Props) {
	'use cache'
	cacheLife({ revalidate: 60 })

	const post = await getNew((await params).slug)

	if (!post) return notFound()

	const navigation = [
		{
			title: 'Главная',
			link: PUBLIC_URL.home(),
		},
		{
			title: 'Университет',
			link: PUBLIC_URL.university(''),
		},
		{
			title: 'Новости',
			link: PUBLIC_URL.university('news'),
		},
		{
			title: post.title,
		},
	]

	return (
		<>
			<Bread navigation={navigation} />
			<SingleNews post={post} />
		</>
	)
}
