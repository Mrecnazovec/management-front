import { Metadata, ResolvingMetadata } from 'next'
import { cacheLife } from 'next/cache'
import { SingleNews } from './SingleNews'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { newService } from '@/services/new.service'
import { notFound } from 'next/navigation'
import { stripHtml } from '@/lib/generateDescription'

const STUB_SLUG = '__news_stub__'

export async function generateStaticParams() {
	try {
		const posts = await newService.getAll()

		if (!posts || posts.length === 0) {
			return [{ slug: STUB_SLUG }]
		}

		return posts.map((post) => ({
			slug: post.slug,
		}))
	} catch {
		return [{ slug: STUB_SLUG }]
	}
}

async function getNew(slug: string) {
	if (slug === STUB_SLUG) return notFound()

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
