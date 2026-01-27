'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Container } from '@/components/ui/Container'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetClassRoom } from '@/hooks/queries/edu-page/useGetClassRoom'
import { useGetClassroomsWithSubjects } from '@/hooks/queries/edu-page/useGetClassroomsWithSubjects'
import { useGetEduPageData } from '@/hooks/queries/edu-page/useGetEduPageData'
import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { generatePdfFromDom } from '@/lib/pdf-generator'
import { TimetableItem } from '@/shared/types/edu-page-timetable.interface'
import {
	addDays,
	areIntervalsOverlapping,
	endOfWeek,
	format,
	formatISO,
	isEqual,
	parse,
	parseISO,
	startOfWeek,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import domtoimage from 'dom-to-image'
import Cookies from 'js-cookie'
import { ArrowLeft, ArrowRight, Calendar1 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { LoaderSkeleton } from '../LoaderSkeleton'
import { ScheduleTable } from '../ScheduleTable'
import Link from 'next/link'
import { PUBLIC_URL } from '@/config/url.config'
import dynamic from 'next/dynamic'

const PDFPrintArea = dynamic(() => import('./PDFPrintArea'), { ssr: false })

const FIND_CLASSROOM_VALUE = 'find'

const BLOCKED_CLASSROOMS = new Set([
	'zoom',
	'аллея литераторов',
	'нууз',
	'планетарий',
	'центр кинологии',
	'школа',
	'школа №50',
	'я. телемост',
	'international hotel tashkent',
	'zoom м-23',
])

export function ClassRoomsSchedule() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const { eduPageData, isLoading } = useGetEduPageData()

	const allClassRooms =
		eduPageData?.r.tables
			.find((t) => t.id === 'classrooms')
			?.data_rows.map((r) => ({
				id: `${r.id}`,
				name: r.name,
				short: r.short,
			}))
			.filter((room) => {
				const label = (room.short ?? room.name ?? '').trim().toLowerCase()
				return label && !BLOCKED_CLASSROOMS.has(label)
			}) || []

	const [hasMounted, setHasMounted] = useState(false)
	const [selectedClassRoomId, setSelectedClassRoomId] = useState(FIND_CLASSROOM_VALUE)
	const [selectedFreeRoomId, setSelectedFreeRoomId] = useState<string | null>(null)
	const isFindMode = selectedClassRoomId === FIND_CLASSROOM_VALUE
	const activeRoomId = isFindMode ? selectedFreeRoomId ?? undefined : selectedClassRoomId || '-143'
	const { classRoom, isLoading: isLoadingClassRoom } = useGetClassRoom(activeRoomId)
	const { classroomsWithSubjects, isLoading: isLoadingFindData } = useGetClassroomsWithSubjects(isFindMode)
	const groupName = activeRoomId ? allClassRooms.find((r) => r.id === activeRoomId)?.short || 'Аудитория' : 'Аудитория'

	const currentFrom = parseISO(searchParams.get('datefrom') ?? getStartOfWeek())
	const currentTo = parseISO(searchParams.get('dateto') ?? getEndOfWeek())
	const [calendarDate, setCalendarDate] = useState<Date | undefined>(currentFrom)

	const [isMobile, setIsMobile] = useState(false)
	const [isSmallScreen, setIsSmallScreen] = useState(false)
	const [isGeneratingImages, setIsGeneratingImages] = useState(true)
	const [tableImages, setTableImages] = useState<string[]>([])
	const [imageLoadedMap, setImageLoadedMap] = useState<Record<number, boolean>>({})
	const [findDate, setFindDate] = useState<string | null>(null)
	const [findPeriod, setFindPeriod] = useState<number | null>(null)
	const [findDuration, setFindDuration] = useState<number>(1)

	useEffect(() => {
		setHasMounted(true)
		const savedClassRoomId = Cookies.get('selected_classroom_id')
		if (savedClassRoomId) {
			setSelectedClassRoomId(savedClassRoomId)
		}
	}, [])

	useEffect(() => {
		setIsMobile(window.matchMedia('(max-width: 1023px)').matches)
		setIsSmallScreen(window.matchMedia('(max-width: 639px)').matches)
	}, [])

	useEffect(() => {
		if (isMobile) {
			setIsGeneratingImages(true)
		}
		setTableImages([])
		setImageLoadedMap({})
	}, [selectedClassRoomId, isMobile])

	const generateTableImages = async () => {
		const container = document.getElementById('pdf-print-area')
		if (!container) return
		const children = Array.from(container.children)
		if (!children.length) return

		for (let i = 0; i < children.length; i++) {
			const node = children[i] as HTMLElement
			try {
				const dataUrl = await domtoimage.toPng(node, { cacheBust: true, bgcolor: '#ffffff' })
				setTableImages((prev) => [...prev, dataUrl])
			} catch (error) {
				console.error('Ошибка при генерации изображения таблицы:', error)
			}
		}
	}

	const handleImageLoad = (index: number) => {
		setImageLoadedMap((prev) => {
			const updated = { ...prev, [index]: true }
			if (Object.keys(updated).length === tableImages.length && Object.values(updated).every(Boolean)) {
				setIsGeneratingImages(false)
			}
			return updated
		})
	}

	const handleChangeClassRoom = (value: string) => {
		setSelectedClassRoomId(value)
		if (value === FIND_CLASSROOM_VALUE) {
			setSelectedFreeRoomId(null)
			Cookies.set('selected_classroom_id', value, { expires: 30 })
			return
		}
		Cookies.set('selected_classroom_id', value, { expires: 30 })
	}

	async function handleDownloadPDF() {
		const { toast } = await import('react-hot-toast')
		const container = document.getElementById('pdf-print-area')
		if (!container) return toast.error('Не найден контейнер для печати')
		await generatePdfFromDom(container, `Аудитория_${format(currentFrom, 'dd.MM')}.pdf`)
	}

	const isNotCurrentWeek = useMemo(() => !isEqual(currentFrom, parseISO(getStartOfWeek())), [currentFrom])

	function changeWeek(direction: 'prev' | 'next') {
		const delta = direction === 'prev' ? -7 : 7
		const newFrom = addDays(currentFrom, delta)
		const newTo = addDays(currentTo, delta)
		const params = new URLSearchParams(searchParams.toString())
		params.set('datefrom', formatISO(newFrom, { representation: 'date' }))
		params.set('dateto', formatISO(newTo, { representation: 'date' }))
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
		setCalendarDate(date)
		router.push(`?${params.toString()}`)
	}

	function returnToCurrentWeek() {
		const from = parseISO(getStartOfWeek())
		const to = parseISO(getEndOfWeek())
		const params = new URLSearchParams(searchParams.toString())
		params.set('datefrom', formatISO(from, { representation: 'date' }))
		params.set('dateto', formatISO(to, { representation: 'date' }))
		setCalendarDate(from)
		router.push(`?${params.toString()}`)
	}

	const weekDates = useMemo(() => {
		const days = []
		for (let i = 0; i < 7; i++) {
			const date = addDays(currentFrom, i)
			if (date.getDay() !== 0) days.push(formatISO(date, { representation: 'date' }))
		}
		return days
	}, [currentFrom])

	const periods = [
		{ number: 1, start: '09:00', end: '10:30' },
		{ number: 2, start: '10:45', end: '12:15' },
		{ number: 3, start: '13:15', end: '14:45' },
		{ number: 4, start: '15:00', end: '16:30' },
		{ number: 5, start: '16:45', end: '18:15' },
	]

	useEffect(() => {
		if (!findDate && weekDates.length > 0) {
			setFindDate(weekDates[0])
		} else if (findDate && !weekDates.includes(findDate) && weekDates.length > 0) {
			setFindDate(weekDates[0])
		}
	}, [findDate, weekDates])

	useEffect(() => {
		if (!findPeriod && periods.length > 0) {
			setFindPeriod(periods[0].number)
		}
	}, [findPeriod, periods])

	const toMinutes = (time: string) => {
		const [hours, minutes] = time.split(':').map((value) => Number(value))
		return hours * 60 + minutes
	}

	const overlaps = (start: string, end: string, periodStart: string, periodEnd: string) => {
		const startMinutes = toMinutes(start)
		const endMinutes = toMinutes(end)
		const pStart = toMinutes(periodStart)
		const pEnd = toMinutes(periodEnd)
		return startMinutes < pEnd && endMinutes > pStart
	}

	const classRoomNameMap = useMemo(
		() => Object.fromEntries(allClassRooms.map((room) => [room.id, room.short ?? room.name ?? room.id])),
		[allClassRooms]
	)

	const freeRooms = useMemo(() => {
		if (!isFindMode || !findDate || !findPeriod || !classroomsWithSubjects) return []
		const period = periods.find((p) => p.number === findPeriod)
		const periodIndex = periods.findIndex((p) => p.number === findPeriod)
		if (!period || periodIndex < 0) return []
		if (findDuration < 1 || findDuration > 5) return []
		if (periodIndex + findDuration > periods.length) return []
		const requiredPeriods = periods.slice(periodIndex, periodIndex + findDuration)

		return classroomsWithSubjects.classrooms
			.filter((room) => {
				const lessons = room.subjects.flatMap((subject) => subject.lessons ?? [])
				const hasLesson = lessons.some((lesson) => {
					if (lesson.date !== findDate || !lesson.starttime || !lesson.endtime) return false
					return requiredPeriods.some((reqPeriod) =>
						overlaps(lesson.starttime, lesson.endtime, reqPeriod.start, reqPeriod.end)
					)
				})
				return !hasLesson
			})
			.map((room) => ({
				id: room.id,
				name: classRoomNameMap[room.id] ?? room.name ?? room.id,
			}))
	}, [isFindMode, findDate, findPeriod, findDuration, classroomsWithSubjects, periods, classRoomNameMap])

	useEffect(() => {
		if (!isFindMode) {
			if (selectedFreeRoomId) setSelectedFreeRoomId(null)
			return
		}
		if (!freeRooms.length) {
			if (selectedFreeRoomId) setSelectedFreeRoomId(null)
			return
		}
		if (!selectedFreeRoomId || !freeRooms.some((room) => room.id === selectedFreeRoomId)) {
			setSelectedFreeRoomId(freeRooms[0].id)
		}
	}, [isFindMode, freeRooms, selectedFreeRoomId])

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

	const subjectMap = useMemo(() => {
		return Object.fromEntries(
			(eduPageData?.r.tables.find((t) => t.id === 'classes')?.data_rows || []).map((r) => [r.id, r.short])
		)
	}, [eduPageData])


	const classroomsMap = useMemo(() => Object.fromEntries(allClassRooms.map((r) => [r.id, r.short])), [allClassRooms])
	const teachersMap = useMemo(() => {
		return Object.fromEntries(
			(eduPageData?.r.tables.find((t) => t.id === 'teachers')?.data_rows || []).map((r) => [r.id, r.short])
		)
	}, [eduPageData])



	const tablesToShow = classRoom ? [classRoom] : []
	const groupIds = allClassRooms.map((r) => r.id)

	useEffect(() => {
		if (
			!isMobile ||
			!classRoom ||
			isLoadingClassRoom ||
			!groupName ||
			(isFindMode && (!findDate || !findPeriod)) ||
			groupName === 'Аудитория'
		) {
			return
		}

		setIsGeneratingImages(true)
		setTableImages([])
		setImageLoadedMap({})

		const timeout = setTimeout(() => {
			generateTableImages().finally(() => setIsGeneratingImages(false))
		}, 300)

		return () => clearTimeout(timeout)
	}, [isMobile, isFindMode, findDate, findPeriod, findDuration, classRoom, isLoadingClassRoom, groupName])

	return (
		<>
			<Container>
				{/* Header */}
				<div className="flex flex-wrap items-center lg:flex-row flex-col lg:justify-between justify-center gap-4 mb-4">
					<div className="flex gap-2 xs:flex-row flex-col justify-center items-center">
						<Select
							value={selectedClassRoomId || 'Аудитория'}
							onValueChange={handleChangeClassRoom}
							disabled={!hasMounted || isLoadingClassRoom}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Выбери аудиторию" />
							</SelectTrigger>
							<SelectContent
								align={isSmallScreen ? 'center' : 'start'}
								viewportClassName="grid sm:grid-cols-3 grid-cols-2 gap-1"
							>
								<SelectItem value={FIND_CLASSROOM_VALUE} className="col-span-2 sm:col-span-3 font-semibold">
									Свободные аудитории
								</SelectItem>
								{allClassRooms.map((room) => (
									<SelectItem key={room.id} value={room.id}>
										{room.short}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Link href={PUBLIC_URL.timetable()}><Button disabled={!hasMounted || isLoading || isLoadingClassRoom} variant='outline' className='text-sm'>
							Предметы
						</Button></Link>
					</div>

					{isNotCurrentWeek && (
						<Button onClick={returnToCurrentWeek} disabled={!hasMounted || isLoadingClassRoom} variant="main" className="text-sm">
							Вернуться к текущей неделе
						</Button>
					)}

					<div className="flex gap-2">
						<Button onClick={() => changeWeek('prev')} disabled={!hasMounted || isLoadingClassRoom} variant="outline">
							<ArrowLeft className="size-4" />
						</Button>
						<Popover>
							<PopoverTrigger asChild>
								<Button disabled={!hasMounted || isLoadingClassRoom} variant="outline">
									<Calendar1 /> {calendarDate ? format(calendarDate, 'dd.MM.yyyy') : 'Дата'}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={calendarDate}
									onSelect={handleDateChange}
									locale={ru}
									weekStartsOn={1}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<Button onClick={() => changeWeek('next')} disabled={!hasMounted || isLoadingClassRoom} variant="outline">
							<ArrowRight className="size-4" />
						</Button>
					</div>
				</div>

				{isFindMode && (
					<div className="mb-4 rounded-lg border border-border p-4">
						<div className="flex flex-wrap gap-3">
							<div className="min-w-[220px]">
								<div className="text-xs text-muted-foreground mb-1">День</div>
								<Select value={findDate ?? ''} onValueChange={(value) => setFindDate(value)}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Выбери день" />
									</SelectTrigger>
									<SelectContent>
										{weekDates.map((date) => {
											const dayName = format(parseISO(date), 'EEE', { locale: ru })
											const formattedDate = format(parseISO(date), 'dd.MM')
											return (
												<SelectItem key={date} value={date}>
													{dayName.charAt(0).toUpperCase() + dayName.slice(1)} {formattedDate}
												</SelectItem>
											)
										})}
									</SelectContent>
								</Select>
							</div>
							<div className="min-w-[220px]">
								<div className="text-xs text-muted-foreground mb-1">Пара</div>
								<Select
									value={findPeriod ? String(findPeriod) : ''}
									onValueChange={(value) => setFindPeriod(Number(value))}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Выбери пару" />
									</SelectTrigger>
									<SelectContent>
										{periods.map((period) => (
											<SelectItem key={period.number} value={String(period.number)}>
												{period.number} ({period.start}-{period.end})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="min-w-[220px]">
								<div className="text-xs text-muted-foreground mb-1">Длительность</div>
								<Select
									value={String(findDuration)}
									onValueChange={(value) => setFindDuration(Number(value))}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Сколько пар" />
									</SelectTrigger>
									<SelectContent>
										{[1, 2, 3, 4, 5].map((count) => (
											<SelectItem key={count} value={String(count)}>
												{count}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="mt-4">
							<div className="text-sm font-medium mb-2">Свободные аудитории: {freeRooms.length}</div>
							{isLoadingFindData ? (
								<Skeleton className="h-[120px] w-full" />
							) : freeRooms.length === 0 ? (
								<div className="text-sm text-muted-foreground">Нет свободных аудиторий</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{freeRooms.map((room) => (
										<Button
											key={room.id}
											variant={selectedFreeRoomId === room.id ? 'main' : 'outline'}
											size="sm"
											onClick={() => setSelectedFreeRoomId(room.id)}
										>
											{room.name}
										</Button>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Desktop версия */}
				{isLoadingClassRoom || isLoading ? (
					<LoaderSkeleton />
				) : isFindMode && !selectedFreeRoomId ? (
					<div className="text-sm text-muted-foreground">Выберите аудиторию из списка</div>
				) : (
					<ScheduleTable
						groupName={groupName}
						periods={periods}
						weekDates={weekDates}
						items={classRoom?.r.ttitems ?? []}
						getSubjectName={(id) => subjectMap[id] ?? null}
						getClassName={(id) => subjectMap[id] ?? null}
						getClassroomsName={(id) => classroomsMap[id] ?? null}
						getTeachersName={(id) => teachersMap[id] ?? null}
						splitIntoPeriodCards={splitIntoPeriodCards}
						highlightedDate={isFindMode ? findDate ?? undefined : undefined}
						highlightedPeriod={isFindMode ? findPeriod ?? undefined : undefined}
						highlightedDuration={isFindMode ? findDuration : undefined}
					/>
				)}

				{/* Скрытая область для печати */}
				<PDFPrintArea
					tablesToShow={tablesToShow}
					groupIds={groupIds}
					eduPageData={eduPageData}
					periods={periods}
					weekDates={weekDates}
					getSubjectName={(id) => subjectMap[id] ?? null}
					getClassroomsName={(id) => subjectMap[id] ?? null}
					getTeachersName={(id) => teachersMap[id] ?? null}
					splitIntoPeriodCards={splitIntoPeriodCards}
					allClassRooms={allClassRooms}
					getClassName={(id) => subjectMap[id] ?? null}
					activeRoomId={activeRoomId}
					highlightedDate={isFindMode ? findDate ?? undefined : undefined}
					highlightedPeriod={isFindMode ? findPeriod ?? undefined : undefined}
					highlightedDuration={isFindMode ? findDuration : undefined}
				/>
			</Container>

			{/* Mobile версия */}
			<div className="block lg:hidden space-y-4 mb-15">
				{isGeneratingImages && tableImages.length === 0
					? Array.from({ length: 1 }).map((_, idx) => <Skeleton key={idx} className="w-full h-[300px]" />)
					: tableImages.map((src, idx) => (
						<div key={idx} className="relative w-full overflow-hidden rounded-lg">
							{!imageLoadedMap[idx] && <Skeleton className="w-full h-[300px]" />}
							<img
								src={src}
								alt={`Расписание аудитории ${idx + 1}`}
								onLoad={() => handleImageLoad(idx)}
								className={`w-full rounded-lg shadow transition-opacity duration-500 ${imageLoadedMap[idx] ? 'opacity-100' : 'opacity-0'
									}`}
							/>
						</div>
					))}
			</div>
		</>
	)
}
