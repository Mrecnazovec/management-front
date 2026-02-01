'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-element/Form'
import { Input } from '@/components/ui/form-element/Input'
import { RichTextEditor } from '@/components/ui/form-element/RichEditor/RichTextEditor'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useApprovePost } from '@/hooks/queries/blog/useApprovePost'
import { useGetPost } from '@/hooks/queries/blog/useGetPost'
import { usePublishPost } from '@/hooks/queries/blog/usePublishPost'
import { useRejectPost } from '@/hooks/queries/blog/useRejectPost'
import { useRetryTelegram } from '@/hooks/queries/blog/useRetryTelegram'
import { useSchedulePost } from '@/hooks/queries/blog/useSchedulePost'
import { useUpdatePost } from '@/hooks/queries/blog/useUpdatePost'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { stripHtml } from '@/lib/generateDescription'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const RUBRIC_VALUE = 'ideas_from_books'

export function PostEditorPage() {
	const { post, isLoading } = useGetPost()
	const { updatePost, isLoading: isSaving } = useUpdatePost()
	const { approvePost, isLoading: isApproving } = useApprovePost()
	const { rejectPost, isLoading: isRejecting } = useRejectPost()
	const { schedulePost, isLoading: isScheduling } = useSchedulePost()
	const { publishPost, isLoading: isPublishing } = usePublishPost()
	const { retryTelegram, isLoading: isRetrying } = useRetryTelegram()

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
		{ title: post?.title || 'Пост' },
	]

	const form = useForm({
		values: {
			title: post?.title || '',
			content: post?.content || '',
			rubric: RUBRIC_VALUE,
			scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString() : '',
		},
	})

	const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
		post?.scheduledAt ? new Date(post.scheduledAt) : undefined,
	)

	useEffect(() => {
		setScheduledDate(post?.scheduledAt ? new Date(post.scheduledAt) : undefined)
		form.setValue('scheduledAt', post?.scheduledAt ? new Date(post.scheduledAt).toISOString() : '')
		form.setValue('rubric', RUBRIC_VALUE)
	}, [post?.scheduledAt])

	const onSubmit = (data: { title: string; content: string; scheduledAt: string }) => {
		if (!post) return
		updatePost({
			id: post.id,
			data: {
				title: data.title,
				content: data.content,
				rubric: RUBRIC_VALUE,
				scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
			},
		})
	}

	const telegramPreview = post
		? [`${post.title}`, '', stripHtml(post.content), '', post.tags?.join(' ')].join('\n')
		: ''

	return (
		<>
			<Bread navigation={navigation} />
			<Container>
				<h1 className='text-3xl mb-6'>Пост</h1>
				{isLoading ? (
					<p>Загрузка...</p>
				) : (
					<div className='grid lg:grid-cols-[2fr_1fr] gap-6'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
								<FormField
									control={form.control}
									name='title'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Заголовок</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='space-y-1'>
									<p className='text-sm font-medium'>Рубрика</p>
									<p className='text-sm text-muted-foreground'>#идеиизкниг</p>
								</div>

								<FormField
									control={form.control}
									name='content'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Текст</FormLabel>
											<FormControl>
												<RichTextEditor value={field.value} onChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='scheduledAt'
									render={() => (
										<FormItem>
											<FormLabel>Запланировать</FormLabel>
											<FormControl>
												<Popover>
													<PopoverTrigger asChild>
														<Button variant='outline' className='justify-start gap-2 w-full'>
															<CalendarDays className='size-4' />
															{scheduledDate
																? format(scheduledDate, 'dd MMMM yyyy', { locale: ru })
																: 'Выберите дату'}
														</Button>
													</PopoverTrigger>
													<PopoverContent className='p-0' align='start'>
														<Calendar
															mode='single'
															selected={scheduledDate}
															onSelect={(date) => {
																setScheduledDate(date)
																form.setValue('scheduledAt', date ? date.toISOString() : '')
															}}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='flex flex-wrap gap-2'>
									<Button type='submit' variant='main' disabled={isSaving}>
										Сохранить
									</Button>
									<Button type='button' variant='outline' disabled={isApproving || !post} onClick={() => post && approvePost(post.id)}>
										Одобрить
									</Button>
									<Button type='button' variant='destructive' disabled={isRejecting || !post} onClick={() => post && rejectPost(post.id)}>
										Отклонить
									</Button>
									<Button
										type='button'
										variant='outline'
										disabled={isScheduling || !post || !scheduledDate}
										onClick={() =>
											post &&
											scheduledDate &&
											schedulePost({ id: post.id, scheduledAt: scheduledDate.toISOString() })
										}
									>
										Запланировать
									</Button>
									<Button type='button' variant='outline' disabled={isPublishing || !post} onClick={() => post && publishPost(post.id)}>
										Опубликовать сейчас
									</Button>
									{post?.telegramFailed && (
										<Button type='button' variant='outline' disabled={isRetrying} onClick={() => post && retryTelegram(post.id)}>
											Повторить Telegram
										</Button>
									)}
								</div>
							</form>
						</Form>

						<div className='space-y-4'>
							<div className='border rounded-xl p-4'>
								<p className='font-medium mb-2'>Site preview</p>
								<p className='text-lg mb-3'>{post?.title}</p>
								<div className='prose max-w-none text-sm' dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
							</div>
							<div className='border rounded-xl p-4'>
								<p className='font-medium mb-2'>Telegram preview</p>
								<pre className='text-sm whitespace-pre-wrap'>{telegramPreview}</pre>
							</div>
						</div>
					</div>
				)}
			</Container>
		</>
	)
}
