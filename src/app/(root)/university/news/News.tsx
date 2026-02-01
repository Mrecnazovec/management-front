'use client'

import { NewsCard } from '@/components/cards/NewsCard'
import { NewsCardSkeleton } from '@/components/cards/NewsCardSkeleton'
import { Container } from '@/components/ui/Container'
import { useGetNews } from '@/hooks/queries/news/useGetNews'
import AOSComponent from '@/lib/aos'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'

export function NewsPage() {
	const [page, setPage] = useState(1)
	const limit = 15
	const { posts, isLoading } = useGetNews({ limit, page })
	const totalPages = posts ? Math.max(1, Math.ceil(posts.total / posts.limit)) : 1

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [page])
	return (
		<AOSComponent>
			<Container>
				<h1 className='text-4xl mb-14' data-aos='fade-up'>Все новости</h1>
				<div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-5'>
					{isLoading ? <NewsCardSkeleton /> : posts?.items?.map((post) => <NewsCard key={post.id} post={post} />)}
				</div>
				{posts && totalPages > 1 && (
					<div className='flex items-center justify-between mt-6'>
						<Button variant='outline' disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
							Назад
						</Button>
						<span className='text-sm text-muted-foreground'>
							Страница {posts.page} из {totalPages}
						</span>
						<Button
							variant='outline'
							disabled={page >= totalPages}
							onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
						>
							Вперёд
						</Button>
					</div>
				)}
			</Container>
		</AOSComponent>
	)
}
