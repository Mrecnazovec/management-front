'use client'

import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/Command'
import { Container } from '@/components/ui/Container'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-element/Form'
import { ImageUpload } from '@/components/ui/form-element/image-upload/ImageUpload'
import { Input } from '@/components/ui/form-element/Input'
import { RichTextEditor } from '@/components/ui/form-element/RichEditor/RichTextEditor'
import { Heading } from '@/components/ui/Heading'
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useCreatePerson } from '@/hooks/queries/persons/useCreatePerson'
import { useDeletePerson } from '@/hooks/queries/persons/useDeletePerson'
import { useUpdatePerson } from '@/hooks/queries/persons/useUpdatePerson'
import { useGetSubjects } from '@/hooks/queries/subjects/useGetSubjects'
import { cn } from '@/lib/utils'
import { IPerson, IPersonForm } from '@/shared/types/person.interface'
import { Check, ChevronsUpDown, Plus, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

interface PersonFormProps {
	person?: IPerson | null
}

export function PersonForm({ person }: PersonFormProps) {
	const params = useParams()
	const role = params.role as string

	const { createPerson, isLoadingCreate } = useCreatePerson(role)
	const { updatePerson, isLoadingUpdate } = useUpdatePerson(role)
	const { deletePerson, isLoadingDelete } = useDeletePerson(role)
	const { subjects, isLoading } = useGetSubjects()

	const title = person ? 'Изменить данные' : 'Добавить человека'
	const description = person ? 'Изменить данные человека' : 'Добавить нового человека'
	const action = person ? 'Сохранить' : 'Добавить'
	const slug = person ? person.slug : ''

	const form = useForm<IPerson>({
		mode: 'onChange',
		defaultValues: {
			name: person?.name || '',
			bio: person?.bio || '',
			slug: person?.slug || '',
			photo: person?.photo || '',
			order: person?.order || 0,
			subjectSlugs: person?.subjects?.map((subject) => subject.slug) || [],
			roles: person?.roles || [],
			types: person?.types || [],
			links: person?.links || [],
		},
	})

	useEffect(() => {
		if (person) {
			form.reset({
				name: person?.name || '',
				bio: person?.bio || '',
				slug: person?.slug || '',
				photo: person?.photo || '',
				order: person?.order || 0,
				subjectSlugs: person?.subjects?.map((subject) => subject.slug) || [],
				roles: person?.roles || [],
				types: person?.types || [],
				links: person?.links || [],
			})
		}
	}, [person, form.reset])

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = form

	const onSubmit = (data: IPersonForm) => {
		if (person) updatePerson({ slug, data })
		else createPerson(data)
	}

	const roleSelector = [
		{ label: 'Учитель', value: 'teachers' },
		{ label: 'Руководство', value: 'administration' },
		{ label: 'Ментор', value: 'mentors' },
		{ label: 'Студ. совет', value: 'union' },
	] as const

	const typeSelector = [
		{ label: 'Статика', value: 'static' },
		{ label: 'Верхушка', value: 'head' },
		{ label: 'Главный', value: 'top' },
		{ label: 'Менеджмент', value: 'management' },
	] as const

	const subjectSelector = useMemo(() => {
		return (subjects || []).map((subject) => ({
			label: subject.title,
			value: subject.slug,
		}))
	}, [subjects])

	return (
		<Container>
			<div className='flex justify-between'>
				<Heading className='mb-4' title={title} description={description} />
				{person && (
					<ConfirmModal handleClick={() => deletePerson({ slug })}>
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
						name='photo'
						rules={{ required: 'Загрузите картинку' }}
						render={({ field }) => (
							<FormItem className='mt-4'>
								<FormLabel>Картинка</FormLabel>
								<FormControl>
									<ImageUpload
										isDisabled={isLoadingCreate || isLoadingDelete || isLoadingUpdate}
										onChange={field.onChange}
										value={field.value}
										isPerson={true}
										folder={role}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='name'
						rules={{ required: 'Имя обязательно' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Имя человека' disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='bio'
						rules={{ required: 'Биография обязательно' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Биография</FormLabel>
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
									<Input {...field} placeholder='lubov-urevna' disabled={isSubmitting} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name='order'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Номер позиции</FormLabel>
								<FormControl>
									<Input {...field} type='number' placeholder='1' disabled={isSubmitting} onChange={(e) => field.onChange(Number(e.target.value))} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name='types'
						rules={{ required: 'Тип обязателен' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Тип</FormLabel>
								<div className='space-y-2'>
									{field.value?.map((typeField, index) => (
										<div key={index} className='flex items-center space-x-2'>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant='outline'
															role='combobox'
															className={cn('w-[200px] justify-between', !typeField && 'text-muted-foreground')}
														>
															{typeSelector.find((type) => type.value === typeField)?.label || 'Выберите тип'}
															<ChevronsUpDown className='opacity-50 ml-2 h-4 w-4' />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className='w-[200px] p-0'>
													<Command>
														<CommandInput placeholder='Выберите тип' className='h-9' />
														<CommandList>
															<CommandEmpty>Тип не найден</CommandEmpty>
															<CommandGroup>
																{typeSelector.map((type) => (
																	<CommandItem
																		key={type.value}
																		value={type.label}
																		onSelect={() => {
																			const updatedValues = [...(field.value || [])]
																			updatedValues[index] = type.value
																			field.onChange(updatedValues)
																		}}
																	>
																		{type.label}
																		<Check className={cn('ml-auto h-4 w-4', type.value === typeField ? 'opacity-100' : 'opacity-0')} />
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<Button
												disabled={isLoadingCreate || isLoadingUpdate}
												type='button'
												variant={'destructive'}
												onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
											>
												Удалить
											</Button>
										</div>
									))}
									<Button
										type='button'
										variant={'outline'}
										onClick={() => field.onChange([...(field.value || []), ''])}
										disabled={isLoadingCreate || isLoadingUpdate}
									>
										<Plus className='mr-2 h-4 w-4' /> Добавить тип
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name='roles'
						rules={{ required: 'Роль обязательна' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Роль</FormLabel>
								<div className='space-y-2'>
									{field.value?.map((roleField, index) => (
										<div key={index} className='flex items-center space-x-2'>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant='outline'
															role='combobox'
															className={cn('w-[200px] justify-between', !roleField && 'text-muted-foreground')}
														>
															{roleSelector.find((role) => role.value === roleField)?.label || 'Выберите роль'}
															<ChevronsUpDown className='opacity-50 ml-2 h-4 w-4' />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className='w-[200px] p-0'>
													<Command>
														<CommandInput placeholder='Выберите тип' className='h-9' />
														<CommandList>
															<CommandEmpty>Роль не найдена</CommandEmpty>
															<CommandGroup>
																{roleSelector.map((role) => (
																	<CommandItem
																		key={role.value}
																		value={role.label}
																		onSelect={() => {
																			const updatedValues = [...(field.value || [])]
																			updatedValues[index] = role.value
																			field.onChange(updatedValues)
																		}}
																	>
																		{role.label}
																		<Check className={cn('ml-auto h-4 w-4', role.value === roleField ? 'opacity-100' : 'opacity-0')} />
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<Button
												disabled={isLoadingCreate || isLoadingUpdate}
												type='button'
												variant={'destructive'}
												onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
											>
												Удалить
											</Button>
										</div>
									))}
									<Button
										type='button'
										variant={'outline'}
										onClick={() => field.onChange([...(field.value || []), ''])}
										disabled={isLoadingCreate || isLoadingUpdate}
									>
										<Plus className='mr-2 h-4 w-4' /> Добавить роль
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name='subjectSlugs'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Выбрать предмет</FormLabel>
								<div className='space-y-2'>
									{field.value?.map((slug, index) => (
										<div key={index} className='flex flex-wrap items-center gap-2 w-full'>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button variant='outline' role='combobox' className={cn('flex-1 justify-between', !slug && 'text-muted-foreground')}>
															{subjectSelector.find((subject) => subject.value === slug)?.label || 'Выберите тип'}
															<ChevronsUpDown className='opacity-50 ml-2 h-4 w-4' />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className='w-full p-0'>
													<Command>
														<CommandInput placeholder='Выберите предмет' className='h-9' />
														<CommandList>
															<CommandEmpty>Предмет не найден</CommandEmpty>
															<CommandGroup>
																{subjectSelector.map((subject) => (
																	<CommandItem
																		key={subject.value}
																		value={subject.label}
																		onSelect={() => {
																			const updatedValues = [...(field.value || [])]
																			updatedValues[index] = subject.value
																			field.onChange(updatedValues)
																		}}
																	>
																		{subject.label}
																		<Check className={cn('ml-auto h-4 w-4', subject.value === slug ? 'opacity-100' : 'opacity-0')} />
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<Button
												disabled={isLoadingCreate || isLoadingUpdate}
												type='button'
												variant={'destructive'}
												onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
											>
												Удалить
											</Button>
										</div>
									))}
									<Button
										type='button'
										variant={'outline'}
										onClick={() => field.onChange([...(field.value || []), ''])}
										disabled={isLoadingCreate || isLoadingUpdate}
									>
										<Plus className='mr-2 h-4 w-4' /> Добавить предмет
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name='links'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ссылки</FormLabel>
								<div className='space-y-4'>
									{field.value?.map((link, index) => (
										<div key={index} className='border p-4 rounded-xl space-y-2'>
											<FormControl>
												<Input
													value={link.title}
													onChange={(e) => {
														const updatedLinks = [...field.value]
														updatedLinks[index].title = e.target.value
														field.onChange(updatedLinks)
													}}
													placeholder='Название ссылки'
													disabled={isSubmitting}
												/>
											</FormControl>

											<FormControl>
												<Input
													value={link.url}
													onChange={(e) => {
														const updatedLinks = [...field.value]
														updatedLinks[index].url = e.target.value
														field.onChange(updatedLinks)
													}}
													placeholder='https://example.com'
													disabled={isSubmitting}
												/>
											</FormControl>

											<FormControl>
												<ImageUpload
													value={link.image}
													onChange={(image) => {
														const updatedLinks = [...field.value]
														updatedLinks[index].image = image
														field.onChange(updatedLinks)
													}}
													isDisabled={isSubmitting}
													folder='links'
												/>
											</FormControl>

											<Button
												type='button'
												variant='destructive'
												onClick={() => {
													const updatedLinks = field.value.filter((_, i) => i !== index)
													field.onChange(updatedLinks)
												}}
												disabled={isSubmitting}
											>
												Удалить ссылку
											</Button>
										</div>
									))}

									<Button
										type='button'
										variant='outline'
										onClick={() => field.onChange([...(field.value || []), { title: '', url: '', image: '' }])}
										disabled={isSubmitting}
									>
										<Plus className='mr-2' /> Добавить ссылку
									</Button>
								</div>
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
