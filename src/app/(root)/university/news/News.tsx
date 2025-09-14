'use client'

import { NewsCard } from '@/components/cards/NewsCard'
import { NewsCardSkeleton } from '@/components/cards/NewsCardSkeleton'
import { Container } from '@/components/ui/Container'
import { useGetNews } from '@/hooks/queries/news/useGetNews'
import AOSComponent from '@/lib/aos'

export function NewsPage() {
	const { posts, isLoading } = useGetNews()
	return (
		<AOSComponent>
			<Container>
				<h1 className='text-4xl mb-14' data-aos='fade-up'>Все новости</h1>
				<div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-5'>
					{isLoading ? <NewsCardSkeleton /> : posts?.map((post) => <NewsCard key={post.id} post={post} />)}
				</div>
			</Container>
		</AOSComponent>
	)
}
