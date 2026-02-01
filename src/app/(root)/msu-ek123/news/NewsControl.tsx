'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ADMIN_URL } from '@/config/url.config'
import { useGetNews } from '@/hooks/queries/news/useGetNews'
import { DateUtil } from '@/lib/dateLib'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function NewsControl() {
	const [page, setPage] = useState(1)
	const limit = 15
	const { posts, isLoading } = useGetNews({ limit, page })
	const totalPages = posts ? Math.max(1, Math.ceil(posts.total / posts.limit)) : 1

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [page])

	return (
		<Container>
			<div className='flex items-center justify-between gap-4 mb-14'>
				<h1 className='text-3xl'>Новости</h1>
				<Link href={ADMIN_URL.news('create')}>
					<Button variant='main'>Добавить</Button>
				</Link>
			</div>
			<div className='grid sm:grid-cols-3 gap-4'>
				{isLoading
					? Array.from({ length: 12 }).map((_, i) => (
							<div key={i} className='animate-pulse'>
								<div className='bg-gray-300 rounded-2xl w-full aspect-[16/9]' />
								<div className='h-4 bg-gray-300 mt-2 rounded w-full' />
								<div className='h-4 bg-gray-300 mt-1 rounded w-3/4 mb-4' />
								<div className='h-4 bg-gray-300 mt-1 rounded w-[30%]' />
							</div>
					  ))
					: posts?.items?.map((post) => (
							<Link key={post.id} href={ADMIN_URL.news(post.slug)}>
								<article className='relative aspect-[16/9] rounded-2xl mb-2'>
									<Image src={post.preview} alt={post.title} fill className='object-cover mb-2 rounded-2xl' />
								</article>
								<p className='line-clamp-2 mb-4'>{post.title}</p>
								<span className='text-muted-foreground'>{DateUtil(post.createdAt)}</span>
							</Link>
					  ))}
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
	)
}
