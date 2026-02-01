'use client'

import { BlogCard } from '@/components/cards/BlogCard'
import { Container } from '@/components/ui/Container'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { PUBLIC_URL } from '@/config/url.config'
import { useGetPublicPosts } from '@/hooks/queries/blog/useGetPublicPosts'
import AOSComponent from '@/lib/aos'

export function BlogPage() {
	const { posts, isLoading } = useGetPublicPosts(30)
	const navigation = [
		{ title: 'Главная', link: PUBLIC_URL.home() },
		{ title: 'Блог' },
	]

	return (
		<AOSComponent>
			<Bread navigation={navigation} />
			<Container>
				<h1 className='text-4xl mb-14' data-aos='fade-up'>
					Блог
				</h1>
				<div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-5'>
					{isLoading
						? Array.from({ length: 9 }).map((_, i) => (
								<div key={i} className='animate-pulse border rounded-2xl p-4'>
									<div className='h-4 bg-gray-300 rounded mb-2 w-3/4' />
									<div className='h-3 bg-gray-300 rounded mb-2 w-full' />
									<div className='h-3 bg-gray-300 rounded mb-2 w-5/6' />
									<div className='h-3 bg-gray-300 rounded w-1/3' />
								</div>
						  ))
						: posts?.map((post) => <BlogCard key={post.id} post={post} />)}
				</div>
			</Container>
		</AOSComponent>
	)
}
