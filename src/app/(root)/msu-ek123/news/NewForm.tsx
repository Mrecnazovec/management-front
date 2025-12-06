'use client'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Container } from '@/components/ui/Container'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-element/Form'
import { ImageUpload } from '@/components/ui/form-element/image-upload/ImageUpload'

import { Input } from '@/components/ui/form-element/Input'
import { RichTextEditor } from '@/components/ui/form-element/RichEditor/RichTextEditor'

import { Heading } from '@/components/ui/Heading'
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal'
import { useCreateNew } from '@/hooks/queries/news/useCreateNew'
import { useDeleteNew } from '@/hooks/queries/news/useDeleteNew'
import { useUpdateNew } from '@/hooks/queries/news/useUpdateNew'
import { INewForm } from '@/shared/types/new.interface'
import { INew } from '@/shared/types/new.interface'
import { Trash } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface NewFormProps {
	post?: INew | null
}

const formatDateTimeLocal = (value?: string | Date | null) => {
	if (!value) return ''

	const date = typeof value === 'string' ? new Date(value) : value
	if (isNaN(date.getTime())) return ''

	const offsetMs = date.getTimezoneOffset() * 60 * 1000
	const localDate = new Date(date.getTime() - offsetMs)

	return localDate.toISOString().slice(0, 16)
}

export function NewForm({ post }: NewFormProps) {
	const { createNew, isLoadingCreate } = useCreateNew()
	const { updateNew, isLoadingUpdate } = useUpdateNew()
	const { deleteNew, isLoadingDelete } = useDeleteNew()

	const title = post ? 'Редактировать новость' : 'Добавить новость'
	const description = post ? 'Измените данные новости' : 'Создайте новую новость'
	const action = post ? 'Сохранить' : 'Создать'
	const slug = post?.slug || ''

	const form = useForm<INewForm>({
		mode: 'onChange',
		defaultValues: {
			text: post?.text || '',
			preview: post?.preview || '',
			slug: post?.slug || '',
			title: post?.title || '',
			isTopNew: post?.isTopNew || false,
			createdAt: formatDateTimeLocal(post?.createdAt ?? null),
		},
	})

	useEffect(() => {
		if (post) {
			form.reset({
				text: post?.text || '',
				preview: post?.preview || '',
				slug: post?.slug || '',
				title: post?.title || '',
				isTopNew: post?.isTopNew || false,
				createdAt: formatDateTimeLocal(post?.createdAt ?? null),
			})
		}
	}, [post, form])

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = form

	const onSubmit = (data: INewForm) => {
		const payload: INewForm = {
			...data,
			createdAt: data.createdAt || undefined,
		}

		if (post) updateNew({ slug, data: payload })
		else createNew(payload)
	}

	return (
		<Container>
			<div className='flex justify-between'>
				<Heading className='mb-4' title={title} description={description} />
				{post && (
					<ConfirmModal handleClick={() => deleteNew({ slug })}>
						<Button size='icon' variant='destructive' disabled={isLoadingDelete}>
							<Trash className='size-4' />
						</Button>
					</ConfirmModal>
				)}
			</div>

			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={control}
						name='preview'
						rules={{ required: 'Загрузите обложку' }}
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>Обложка</FormLabel>
								<FormControl>
									<ImageUpload
										isDisabled={isLoadingCreate || isLoadingDelete || isLoadingUpdate}
										onChange={field.onChange}
										value={field.value}
										folder={'news'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='title'
						rules={{ required: 'Название обязательно' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Название</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Название' disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='text'
						rules={{ required: 'Текст обязателен' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Текст</FormLabel>
								<FormControl>
									<RichTextEditor value={field.value} onChange={field.onChange} disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='slug'
						// rules={{ required: 'Slug обязателен' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input {...field} placeholder='first-new' disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='createdAt'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Дата публикации</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ? String(field.value) : ''}
										type='datetime-local'
										placeholder='2025-12-06T12:00'
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='isTopNew'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Топ новость?</FormLabel>
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type='submit' variant={'main'} disabled={isSubmitting || isLoadingCreate || isLoadingUpdate} className='mt-4'>
						{action}
					</Button>
				</form>
			</Form>
		</Container>
	)
}
