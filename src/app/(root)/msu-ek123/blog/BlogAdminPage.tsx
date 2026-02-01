'use client'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Container } from '@/components/ui/Container'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import { useBlogSettings } from '@/hooks/queries/blog/useBlogSettings'
import { useGetBooks } from '@/hooks/queries/blog/useGetBooks'
import { useGetPosts } from '@/hooks/queries/blog/useGetPosts'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function BlogAdminPage() {
	const { books, isLoading: isLoadingBooks } = useGetBooks()
	const [page, setPage] = useState(1)
	const limit = 10
	const { posts, isLoading: isLoadingPosts } = useGetPosts({ page, limit })
	const { settings, updateSettings, isSaving } = useBlogSettings()
	const totalPages = posts ? Math.max(1, Math.ceil(posts.total / posts.limit)) : 1
	const navigation = [
		{ title: 'Главная', link: PUBLIC_URL.home() },
		{ title: 'Админ панель', link: ADMIN_URL.home() },
		{ title: 'Блог' },
	]

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [page])

	return (
		<>
			<Bread navigation={navigation} />
			<Container>
				<div className='flex items-center justify-between gap-4 mb-10'>
					<h1 className='text-3xl'>Блог</h1>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								checked={settings?.autoPublish || false}
								onCheckedChange={(value) => updateSettings({ autoPublish: Boolean(value) })}
								disabled={isSaving}
							/>
							<span className='text-sm'>Авто-публикация по порядку</span>
						</div>
						<Link href={ADMIN_URL.blog('import')}>
							<Button variant='main'>Импорт книги</Button>
						</Link>
					</div>
				</div>

				<section className='mb-12'>
					<h2 className='text-2xl mb-4'>Книги</h2>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{isLoadingBooks
							? Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className='animate-pulse border rounded-2xl p-4'>
										<div className='h-4 bg-gray-300 rounded mb-2 w-3/4' />
										<div className='h-3 bg-gray-300 rounded mb-2 w-1/2' />
										<div className='h-3 bg-gray-300 rounded w-2/3' />
									</div>
								))
							: books?.map((book) => (
									<Link key={book.id} href={ADMIN_URL.blog(book.id)} className='border rounded-2xl p-4 hover:shadow-md transition-shadow'>
										<p className='font-medium mb-1'>{book.title}</p>
										<p className='text-sm text-muted-foreground mb-2'>{book.author}</p>
										<p className='text-xs text-muted-foreground'>
											Черновиков: {book.postsCount ?? 0} • Опубликовано: {book.publishedCount ?? 0}
										</p>
									</Link>
								))}
					</div>
				</section>

				<section>
					<h2 className='text-2xl mb-4'>Посты</h2>
					<div className='space-y-2'>
						{isLoadingPosts
							? Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className='animate-pulse border rounded-xl p-3'>
										<div className='h-4 bg-gray-300 rounded mb-2 w-3/4' />
										<div className='h-3 bg-gray-300 rounded w-1/2' />
									</div>
								))
							: posts?.items?.map((post) => (
									<Link key={post.id} href={ADMIN_URL.blog(`posts/${post.id}`)} className='block border rounded-xl p-3 hover:shadow-sm'>
										<p className='font-medium'>{post.title}</p>
										<p className='text-xs text-muted-foreground'>
											Статус: {post.status} • Рубрика: {post.rubric}
										</p>
									</Link>
								))}
					</div>
					{posts && totalPages > 1 && (
						<div className='flex items-center justify-between mt-4'>
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
				</section>
			</Container>
		</>
	)
}
