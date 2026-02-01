'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-element/Form'
import { Input } from '@/components/ui/form-element/Input'
import { useDeleteBook } from '@/hooks/queries/blog/useDeleteBook'
import { useGetBook } from '@/hooks/queries/blog/useGetBook'
import { useGetPosts } from '@/hooks/queries/blog/useGetPosts'
import { useImportBook } from '@/hooks/queries/blog/useImportBook'
import { useUpdateBook } from '@/hooks/queries/blog/useUpdateBook'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import { blogService } from '@/services/blog.service'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export function BookDetailsPage() {
	const { book, isLoading: isLoadingBook, bookId } = useGetBook()
	const [page, setPage] = useState(1)
	const limit = 10
	const { posts } = useGetPosts({ bookId, page, limit })
	const { updateBook, isLoading: isUpdatingBook } = useUpdateBook()
	const { deleteBook, isLoading: isDeletingBook } = useDeleteBook()
	const { importBook, isLoading: isImporting } = useImportBook()
	const [sourceFile, setSourceFile] = useState<File | null>(null)
	const [isUploadingSource, setIsUploadingSource] = useState(false)
	const [postsFile, setPostsFile] = useState<File | null>(null)
	const totalPages = posts ? Math.max(1, Math.ceil(posts.total / posts.limit)) : 1

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [page])

	const navigation = [
		{
			title: 'Главная',
			link: PUBLIC_URL.home(),
		},
		{
			title: 'Админ панель',
			link: ADMIN_URL.home(),
		},
		{ title: 'Блог', link: ADMIN_URL.blog() },
		{ title: book?.title || 'Книга' },
	]

	const form = useForm({
		values: {
			title: book?.title || '',
			author: book?.author || '',
			year: book?.year?.toString() || '',
			sourceUrl: book?.sourceUrl || '',
		},
	})

	const onSubmit = (data: { title: string; author: string; year: string; sourceUrl: string }) => {
		if (!bookId) return
		updateBook({
			id: bookId,
			data: {
				title: data.title,
				author: data.author,
				year: data.year ? Number(data.year) : undefined,
				sourceUrl: data.sourceUrl,
			},
		})
	}

	const handleSourceUpload = async () => {
		if (!sourceFile || !bookId) return
		setIsUploadingSource(true)
		try {
			const response = await blogService.uploadSource(sourceFile)
			if (!response?.url) {
				throw new Error('upload failed')
			}
			form.setValue('sourceUrl', response.url, { shouldDirty: true })
			updateBook({ id: bookId, data: { sourceUrl: response.url } })
			toast.success('Источник обновлён')
		} catch {
			toast.error('Не удалось загрузить источник')
		} finally {
			setIsUploadingSource(false)
		}
	}

	const handleImportPosts = () => {
		if (!postsFile || !bookId) return
		const sourceUrl = form.getValues('sourceUrl') || book?.sourceUrl
		if (!sourceUrl) {
			toast.error('Сначала загрузите файл книги в бакет')
			return
		}
		importBook(
			{ file: postsFile, sourceUrl, bookId },
			{
				onSuccess: () => {
					setPostsFile(null)
					toast.success('Посты добавлены')
				},
			},
		)
	}

	const handleDelete = () => {
		if (!bookId) return
		const confirmed = window.confirm('Удалить книгу и все связанные посты?')
		if (!confirmed) return
		deleteBook({ id: bookId })
	}

	return (
		<>
			<Bread navigation={navigation} />
			<Container>
				<div className='flex items-center justify-between mb-6 gap-4 flex-wrap'>
					<h1 className='text-3xl'>Книга</h1>
					<div className='flex items-center gap-3'>
						<Button variant='destructive' onClick={handleDelete} disabled={!bookId || isDeletingBook}>
							Удалить книгу
						</Button>
						<Link href={ADMIN_URL.blog()}>
							<Button variant='outline'>Назад</Button>
						</Link>
					</div>
				</div>

				{isLoadingBook ? (
					<p>Загрузка...</p>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 md:grid-cols-2 mb-6'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='author'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Автор</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='year'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Год</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='sourceUrl'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Источник</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='md:col-span-2'>
								<Button type='submit' variant='main' disabled={isUpdatingBook}>
									Сохранить
								</Button>
							</div>
						</form>
					</Form>
				)}

				<div className='border rounded-2xl p-4 mb-6'>
					<p className='font-medium mb-2'>Загрузка книги в бакет</p>
					<div className='flex items-center gap-3 flex-wrap'>
						<Input
							type='file'
							onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)}
							disabled={isUploadingSource}
						/>
						<Button
							variant='main'
							onClick={handleSourceUpload}
							disabled={!sourceFile || isUploadingSource || !bookId}
						>
							{isUploadingSource ? 'Загрузка...' : 'Заменить источник'}
						</Button>
					</div>
					<p className='text-xs text-muted-foreground mt-2'>
						После загрузки источник книги будет заменён на новый файл.
					</p>
				</div>

				<div className='border rounded-2xl p-4 mb-10'>
					<p className='font-medium mb-2'>Добавить посты из JSON</p>
					<div className='flex items-center gap-3 flex-wrap'>
						<Input
							type='file'
							accept='application/json'
							onChange={(event) => setPostsFile(event.target.files?.[0] ?? null)}
							disabled={isImporting}
						/>
						<Button
							variant='main'
							onClick={handleImportPosts}
							disabled={!postsFile || isImporting || !bookId}
						>
							{isImporting ? 'Импорт...' : 'Добавить посты'}
						</Button>
					</div>
					<p className='text-xs text-muted-foreground mt-2'>
						Посты будут добавлены к текущей книге. Используется ссылка на книгу из бакета.
					</p>
				</div>

				<section>
					<h2 className='text-2xl mb-4'>Посты</h2>
					<div className='space-y-2'>
						{posts?.items?.map((post) => (
							<Link key={post.id} href={ADMIN_URL.blog(`posts/${post.id}`)} className='block border rounded-xl p-3'>
								<p className='font-medium'>{post.title}</p>
								<p className='text-xs text-muted-foreground'>Статус: {post.status} • Рубрика: {post.rubric}</p>
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
