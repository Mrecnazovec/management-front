'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Container } from '@/components/ui/Container'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { PUBLIC_URL } from '@/config/url.config'
import { useGetAllEduPageTimeTables } from '@/hooks/queries/edu-page/useGetAllEduPageTimeTables'
import { useGetEduPageData } from '@/hooks/queries/edu-page/useGetEduPageData'
import { useGetEduPageTimetableImages } from '@/hooks/queries/edu-page/useGetEduPageTimetableImages'
import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { generatePdfFromImageUrls } from '@/lib/pdf-generator'
import { eduPageService } from '@/services/edupage.service'
import { TimetableItem } from '@/shared/types/edu-page-timetable.interface'
import { addDays, areIntervalsOverlapping, endOfWeek, format, formatISO, parse, parseISO, startOfWeek } from 'date-fns'
import { ru } from 'date-fns/locale'
import Cookies from 'js-cookie'
import { isEqual } from 'lodash'
import { ArrowLeft, ArrowRight, Calendar1, FileDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { LoaderSkeleton } from './LoaderSkeleton'
import { ScheduleTable } from './ScheduleTable'

export function Schedule() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const groupId = Cookies.get('group_id') ?? '-272'
	const id = groupId ?? searchParams.get('id') ?? '-272'

	const groupIds = ['-272', '-274', '-270', '-271', '-268', '-269']
	const [isMobile, setIsMobile] = useState<boolean | null>(null)
	const shouldLoadImages = isMobile === true
	const shouldLoadTables = isMobile === false
	const { eduPageData, isLoading } = useGetEduPageData(shouldLoadTables)
	const { timeTables, isLoading: isLoadingTimeTable } = useGetAllEduPageTimeTables(groupIds, shouldLoadTables)

	const currentFrom = parseISO(searchParams.get('datefrom') ?? getStartOfWeek())
	const currentTo = parseISO(searchParams.get('dateto') ?? getEndOfWeek())
	const [calendarDate, setCalendarDate] = useState<Date | undefined>(currentFrom)
	const [imageLoadedMap, setImageLoadedMap] = useState<Record<number, boolean>>({})
	const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

	const myGroupId = Cookies.get('group_id') ?? '-272'

	useEffect(() => {
		const match = window.matchMedia('(max-width: 1023px)')
		const handleChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches)
		}
		setIsMobile(match.matches)
		if (match.addEventListener) {
			match.addEventListener('change', handleChange)
		} else {
			match.addListener(handleChange)
		}
		return () => {
			if (match.removeEventListener) {
				match.removeEventListener('change', handleChange)
			} else {
				match.removeListener(handleChange)
			}
		}
	}, [])

	const tablesToShow = useMemo(() => {
		if (id === 'all') return timeTables
		const index = groupIds.indexOf(id)
		if (index === -1) return []
		return [timeTables[index]]
	}, [id, timeTables])

	const selectedIds = useMemo(() => {
		if (id === 'all') return groupIds
		return groupIds.includes(id) ? [id] : []
	}, [id, groupIds])

	const { images: tableImages, isLoading: isLoadingImages } = useGetEduPageTimetableImages(selectedIds, shouldLoadImages)
	const imageUrls = useMemo(() => tableImages.map((image) => image.url), [tableImages])
	const imageUrlsKey = useMemo(() => imageUrls.join('|'), [imageUrls])

	useEffect(() => {
		setImageLoadedMap({})
	}, [imageUrlsKey])

	const periods = [
		{ number: 1, start: '09:00', end: '10:30' },
		{ number: 2, start: '10:45', end: '12:15' },
		{ number: 3, start: '13:15', end: '14:45' },
		{ number: 4, start: '15:00', end: '16:30' },
		{ number: 5, start: '16:45', end: '18:15' },
	]

	const groupSelector = [
		{ groupName: 'Полное расписание', id: 'all' },
		{ groupName: '1 курс Эк1-25', id: '-268' },
		{ groupName: '1 курс Эк2-25', id: '-269' },
		{ groupName: '2 курс Эк1-24', id: '-270' },
		{ groupName: '2 курс Эк2-24', id: '-271' },
		{ groupName: '3 курс Эк1-23', id: '-272' },
		{ groupName: '3 курс Эк2-23', id: '-274' },
	]

	const weekDates = useMemo(() => {
		const days = []
		for (let i = 0; i < 7; i++) {
			const date = addDays(currentFrom, i)
			if (date.getDay() !== 0) {
				days.push(formatISO(date, { representation: 'date' }))
			}
		}
		return days
	}, [currentFrom])

	const handleDownloadPDF = async () => {
		const { toast } = await import('react-hot-toast')
		toast.success('Начинается конвертация')
		if (isDownloadingPdf) return
		if (selectedIds.length === 0) {
			return toast.error('Выберите группу для скачивания')
		}
		setIsDownloadingPdf(true)
		try {
			const dateFrom = formatISO(currentFrom, { representation: 'date' })
			const dateTo = formatISO(currentTo, { representation: 'date' })
			const { images } = await eduPageService.getTimetableImagesData(dateFrom, dateTo, selectedIds)
			const imageMap = new Map(images.map((image) => [image.id, image.dataUrl]))
			const urls = selectedIds.map((id) => imageMap.get(id)).filter((url): url is string => Boolean(url))
			if (urls.length === 0) {
				return toast.error('Не удалось получить изображения расписания')
			}
			await generatePdfFromImageUrls(urls, `Расписание_${format(currentFrom, 'dd.MM')}.pdf`)
		} catch (error) {
			toast.error('Не удалось скачать PDF')
		} finally {
			setIsDownloadingPdf(false)
		}
	}


	const handleImageLoad = (index: number) => {
		setImageLoadedMap((prev) => ({ ...prev, [index]: true }))
	}

	const isNotCurrentWeek = useMemo(() => {
		return !isEqual(currentFrom, parseISO(getStartOfWeek()))
	}, [currentFrom])

	function returnToCurrentWeek() {
		const from = parseISO(getStartOfWeek())
		const to = parseISO(getEndOfWeek())
		const params = new URLSearchParams(searchParams.toString())
		params.set('datefrom', formatISO(from, { representation: 'date' }))
		params.set('dateto', formatISO(to, { representation: 'date' }))
		if (isMobile) {
			setImageLoadedMap({})
		}
		setCalendarDate(from)
		router.push(`?${params.toString()}`)
	}

	function changeWeek(direction: 'prev' | 'next') {
		const delta = direction === 'prev' ? -7 : 7
		const newFrom = addDays(currentFrom, delta)
		const newTo = addDays(currentTo, delta)
		const params = new URLSearchParams(searchParams.toString())
		params.set('datefrom', formatISO(newFrom, { representation: 'date' }))
		params.set('dateto', formatISO(newTo, { representation: 'date' }))
		if (isMobile) {
			setImageLoadedMap({})
		}
		setCalendarDate(newFrom)
		router.push(`?${params.toString()}`)
	}

	function handleDateChange(date: Date | undefined) {
		if (!date) return
		const newFrom = startOfWeek(date, { locale: ru, weekStartsOn: 1 })
		const newTo = endOfWeek(date, { locale: ru, weekStartsOn: 1 })
		const params = new URLSearchParams(searchParams.toString())
		params.set('datefrom', formatISO(newFrom, { representation: 'date' }))
		params.set('dateto', formatISO(newTo, { representation: 'date' }))
		if (isMobile) {
			setImageLoadedMap({})
		}
		setCalendarDate(date)
		router.push(`?${params.toString()}`)
	}

	const subjectMap = useMemo(() => {
		return Object.fromEntries((eduPageData?.r.tables.find((t) => t.id === 'subjects')?.data_rows || []).map((r) => [r.id, r.short]))
	}, [eduPageData])

	const getSubjectName = (id: string) => subjectMap[id] ?? null

	const classroomsMap = useMemo(() => {
		return Object.fromEntries((eduPageData?.r.tables.find((t) => t.id === 'classrooms')?.data_rows || []).map((r) => [r.id, r.short]))
	}, [eduPageData])

	const getClassroomsName = (id: string) => classroomsMap[id] ?? null

	const teachersMap = useMemo(() => {
		return Object.fromEntries((eduPageData?.r.tables.find((t) => t.id === 'teachers')?.data_rows || []).map((r) => [r.id, r.short]))
	}, [eduPageData])

	const getTeachersName = (id: string) => teachersMap[id] ?? null

	function splitIntoPeriodCards(item: TimetableItem) {
		const startTime = parse(item.starttime, 'HH:mm', new Date())
		const endTime = parse(item.endtime, 'HH:mm', new Date())
		return periods
			.filter((period) => {
				const periodStart = parse(period.start, 'HH:mm', new Date())
				const periodEnd = parse(period.end, 'HH:mm', new Date())
				return areIntervalsOverlapping({ start: startTime, end: endTime }, { start: periodStart, end: periodEnd })
			})
			.map((period) => ({ ...item, uniperiod: period.number.toString(), starttime: period.start, endtime: period.end }))
	}
	function handleGroupChange(newId: string) {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('id', newId)
		Cookies.set('group_id', newId, { expires: 30 })
		router.push(`?${newParams.toString()}`)
	}

	return (
		<>
			<Container>
				{/* Header */}
				<div className='flex flex-wrap items-center lg:flex-row flex-col lg:justify-between justify-center gap-4 mb-4'>
					<div className='flex gap-2 xs:flex-row flex-col justify-center items-center'>
						<Button onClick={handleDownloadPDF} variant='outline' className='gap-2'>
							<FileDown className='w-4 h-4' /> Скачать PDF
						</Button>
						<Select disabled={isLoading || isLoadingTimeTable} value={id} onValueChange={handleGroupChange}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Выберите группу' />
							</SelectTrigger>
							<SelectContent>
								{groupSelector.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.groupName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Link href={PUBLIC_URL.timetable('classrooms')}><Button disabled={isLoading || isLoadingTimeTable} variant='outline' className='text-sm'>
							Аудитории
						</Button></Link>
					</div>



					{isNotCurrentWeek && (
						<Button onClick={returnToCurrentWeek} disabled={isLoading || isLoadingTimeTable} variant='main' className='text-sm'>
							Вернуться к текущей неделе
						</Button>
					)}

					<div className='flex gap-2'>
						<Button onClick={() => changeWeek('prev')} disabled={isLoading || isLoadingTimeTable} variant={'outline'}>
							<ArrowLeft className='size-4' />
						</Button>
						<Popover>
							<PopoverTrigger asChild>
								<Button disabled={isLoading || isLoadingTimeTable} variant='outline'>
									<Calendar1 /> {calendarDate ? format(calendarDate, 'dd.MM.yyyy') : 'Дата'}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0'>
								<Calendar mode='single' selected={calendarDate} onSelect={handleDateChange} locale={ru} weekStartsOn={1} initialFocus />
							</PopoverContent>
						</Popover>
						<Button onClick={() => changeWeek('next')} disabled={isLoading || isLoadingTimeTable} variant={'outline'}>
							<ArrowRight className='size-4' />
						</Button>
					</div>
				</div>
				{/* Desktop schedule */}
				{shouldLoadTables &&
					(isLoading || isLoadingTimeTable ? (
						<LoaderSkeleton />
					) : (
						tablesToShow.map((tableData, index) => {
							const items = tableData?.r.ttitems ?? []
							const classId = myGroupId !== 'all' ? myGroupId : groupIds[index]
							const groupName =
								eduPageData?.r.tables.find((t) => t.id === 'classes')?.data_rows.find((r) => r.id === classId)?.name ?? `Группа ${classId}`
							return (
								<ScheduleTable
									key={index}
									groupName={groupName}
									periods={periods}
									weekDates={weekDates}
									items={items}
									getSubjectName={getSubjectName}
									getClassroomsName={getClassroomsName}
									getTeachersName={getTeachersName}
									splitIntoPeriodCards={splitIntoPeriodCards}
								/>
							)
						})
					))}
			</Container>
			{/* Mobile расписание */}
			{shouldLoadImages && (
				<div className='block lg:hidden space-y-4 mb-15'>
					{isLoadingImages || imageUrls.length === 0
						? Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className='w-full h-[300px]' />)
						: imageUrls.map((src, idx) => (
							<div key={idx} className='relative w-full overflow-hidden'>
								{!imageLoadedMap[idx] && <Skeleton className='w-full h-[300px]' />}
								<img
									src={src}
									alt={`Расписание ${idx + 1}`}
									onLoad={() => handleImageLoad(idx)}
									className={`w-full shadow transition-opacity duration-500 ${imageLoadedMap[idx] ? 'opacity-100' : 'opacity-0'}`}
								/>
							</div>
						))}
				</div>
			)}
		</>
	)
}
