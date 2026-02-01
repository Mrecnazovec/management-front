'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Container } from '@/components/ui/Container'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-element/Form'
import { ImageUpload } from '@/components/ui/form-element/image-upload/ImageUpload'
import { Input } from '@/components/ui/form-element/Input'
import { RichTextEditor } from '@/components/ui/form-element/RichEditor/RichTextEditor'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Heading } from '@/components/ui/Heading'
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal'
import { useCreateNew } from '@/hooks/queries/news/useCreateNew'
import { useDeleteNew } from '@/hooks/queries/news/useDeleteNew'
import { useUpdateNew } from '@/hooks/queries/news/useUpdateNew'
import { INew } from '@/shared/types/new.interface'
import { INewForm } from '@/shared/types/new.interface'
import { Calendar as CalendarIcon, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface NewFormProps {
	post?: INew | null
	showPublishToTelegram?: boolean
}

const toDateOrUndefined = (value?: string | Date | null) => {
	if (!value) return undefined
	const date = typeof value === 'string' ? new Date(value) : value
	return isNaN(date.getTime()) ? undefined : date
}

const mergeDateAndTime = (date: Date, timeSource?: Date) => {
	// Keep selected day intact by defaulting time to midday, avoiding timezone shifts that move it to the previous day
	const hours = timeSource ? timeSource.getHours() : 12
	const minutes = timeSource ? timeSource.getMinutes() : 0
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
}

const setTimeOnDate = (timeValue: string, currentDate?: Date) => {
	const [hours = 0, minutes = 0] = timeValue.split(':').map((value) => Number(value) || 0)
	const base = currentDate ?? new Date()
	return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours, minutes)
}

export function NewForm({ post, showPublishToTelegram }: NewFormProps) {
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
			publishToTelegram: false,
			createdAt: toDateOrUndefined(post?.createdAt ?? null),
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
				publishToTelegram: false,
				createdAt: toDateOrUndefined(post?.createdAt ?? null),
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
		<FormItem className='space-y-2'>
			<FormLabel>Дата публикации</FormLabel>
			<div className='flex flex-col gap-2 sm:flex-row'>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className='w-full justify-start sm:w-[220px]'
							disabled={isSubmitting}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{field.value ? (
								format(field.value as Date, 'dd.MM.yyyy')
							) : (
								<span className='text-muted-foreground'>Выберите дату</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						<Calendar
							mode='single'
							selected={field.value ? (field.value as Date) : undefined}
							onSelect={(date) => field.onChange(date ? mergeDateAndTime(date, field.value as Date | undefined) : undefined)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
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
{showPublishToTelegram && (
	<FormField
		control={control}
		name='publishToTelegram'
		render={({ field }) => (
			<FormItem>
				<FormLabel>Опубликовать в канале?</FormLabel>
				<FormControl>
					<Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
)}
<Button type='submit' variant={'main'} disabled={isSubmitting || isLoadingCreate || isLoadingUpdate} className='mt-4'>
						{action}
					</Button>
				</form>
			</Form>
		</Container>
	)
}




