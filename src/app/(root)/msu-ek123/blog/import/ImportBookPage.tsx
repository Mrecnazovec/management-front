'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import { Input } from '@/components/ui/form-element/Input'
import { useImportBook } from '@/hooks/queries/blog/useImportBook'
import { blogService } from '@/services/blog.service'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

type Preview = {
	book?: {
		title?: string
		author?: string
		year?: number
		sourceUrl?: string
		source?: string
	}
	posts?: { order?: number; title: string }[]
}

export function ImportBookPage() {
	const { importBook, isLoading } = useImportBook()
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
		{ title: 'Импорт' },
	]
	const [file, setFile] = useState<File | null>(null)
	const [sourceFile, setSourceFile] = useState<File | null>(null)
	const [sourceUrl, setSourceUrl] = useState<string | null>(null)
	const [isUploadingSource, setIsUploadingSource] = useState(false)
	const [sourceError, setSourceError] = useState<string | null>(null)
	const [preview, setPreview] = useState<Preview | null>(null)
	const [result, setResult] = useState<string | null>(null)

	const handleFile = (selected: File | null) => {
		setFile(selected)
		setResult(null)
		if (!selected) {
			setPreview(null)
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			try {
				const parsed = JSON.parse(reader.result as string)
				setPreview({
					book: parsed.book,
					posts: parsed.posts?.slice?.(0, 3) ?? [],
				})
			} catch {
				setPreview(null)
			}
		}
		reader.readAsText(selected)
	}

	const hasPreview = useMemo(() => preview?.book && Array.isArray(preview?.posts), [preview])
	const previewSource = sourceUrl

	const handleImport = () => {
		if (!file) return
		importBook(
			{ file, sourceUrl: sourceUrl ?? undefined },
			{
				onSuccess: (data: any) => {
					setResult(`Импортировано: ${data?.imported ?? 0}. ID книги: ${data?.bookId ?? '-'}`)
				},
			},
		)
	}

	const handleSourceUpload = async () => {
		if (!sourceFile) return
		setIsUploadingSource(true)
		setSourceError(null)
		try {
			const response = await blogService.uploadSource(sourceFile)
			setSourceUrl(response?.url ?? null)
			toast.success('Источник загружен')
		} catch {
			setSourceError('Не удалось загрузить файл источника')
			setSourceUrl(null)
		} finally {
			setIsUploadingSource(false)
		}
	}

	return (
		<>
			<Bread navigation={navigation} />
			<Container>
				<h1 className='text-3xl mb-8'>Импорт книги</h1>
				<div className='space-y-4'>
					<Input
						type='file'
						accept='application/json'
						onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
						disabled={isLoading}
					/>

					<div className='border rounded-2xl p-4 space-y-3'>
						<p className='font-medium'>Источник (файл книги)</p>
						<Input
							type='file'
							onChange={(event) => {
								setSourceFile(event.target.files?.[0] ?? null)
								setSourceUrl(null)
								setSourceError(null)
							}}
							disabled={isUploadingSource}
						/>
						<div className='flex items-center gap-3 flex-wrap'>
							<Button
								variant='main'
								onClick={handleSourceUpload}
								disabled={!sourceFile || isUploadingSource}
							>
								{isUploadingSource ? 'Загрузка...' : 'Загрузить книгу'}
							</Button>
							{sourceUrl && (
								<span className='text-xs break-all'>Ссылка: {sourceUrl}</span>
							)}
						</div>
						{sourceUrl && (
							<p className='text-xs text-muted-foreground'>
								Ссылка будет передана как sourceUrl при импорте.
							</p>
						)}
						{sourceError && <p className='text-xs text-red-500'>{sourceError}</p>}
					</div>

					{hasPreview && (
						<div className='border rounded-2xl p-4'>
							<p className='font-medium mb-2'>Предпросмотр</p>
							<p className='text-sm'>Название: {preview?.book?.title}</p>
							<p className='text-sm'>Автор: {preview?.book?.author}</p>
							<p className='text-sm mb-3'>
								Источник: {previewSource || 'Нужно загрузить файл книги'}
							</p>
							<p className='text-sm font-medium mb-2'>Первые посты:</p>
							<ul className='text-sm space-y-2'>
								{preview?.posts?.map((post, index) => (
									<li key={`${post.title}-${index}`} className='border rounded-lg p-2'>
										<p className='text-xs text-muted-foreground mb-1'>#{post.order ?? index + 1}</p>
										<p className='line-clamp-2'>{post.title}</p>
									</li>
								))}
							</ul>
						</div>
					)}

					<Button variant='main' onClick={handleImport} disabled={!file || !sourceUrl || isLoading}>
						Импортировать
					</Button>
					{!sourceUrl && <p className='text-xs text-red-500'>Сначала загрузите файл книги в бакет.</p>}
					{result && <p className='text-sm text-muted-foreground'>{result}</p>}
				</div>
			</Container>
		</>
	)
}
