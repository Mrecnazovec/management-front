import { Metadata, ResolvingMetadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { SingleBlog } from './SingleBlog'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { PUBLIC_URL } from '@/config/url.config'
import { blogService } from '@/services/blog.service'

const STUB_SLUG = '__blog_stub__'

export async function generateStaticParams() {
	try {
		const posts = await blogService.getPublicPosts()
		if (!posts || posts.length === 0) return [{ slug: STUB_SLUG }]
		return posts.map((post) => ({ slug: post.slug }))
	} catch {
		return [{ slug: STUB_SLUG }]
	}
}

async function getPost(slug: string) {
	if (slug === STUB_SLUG) return notFound()
	try {
		return await blogService.getPublicPost(slug)
	} catch {
		return notFound()
	}
}

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
	'use cache'
	cacheLife({ revalidate: 60 })

	const post = await getPost((await params).slug)
	if (!post) return {}

	return {
		title: post.title,
		description: post.excerpt || post.content?.slice(0, 160),
	}
}

export default async function Page({ params }: Props) {
	'use cache'
	cacheLife({ revalidate: 60 })

	const post = await getPost((await params).slug)
	if (!post) return notFound()

	const navigation = [
		{ title: 'Главная', link: PUBLIC_URL.home() },
		{ title: 'Блог', link: PUBLIC_URL.blog() },
		{ title: post.title },
	]

	return (
		<>
			<Bread navigation={navigation} />
			<SingleBlog post={post} />
		</>
	)
}
