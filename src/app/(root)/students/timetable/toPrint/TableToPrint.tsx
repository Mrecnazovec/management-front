import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { TimetableItem } from '@/shared/types/edu-page-timetable.interface'

interface ScheduleTableProps {
	groupName: string
	periods: { number: number; start: string; end: string }[]
	weekDates: string[]
	items: TimetableItem[]
	getSubjectName: (id: string) => string | null
	getClassroomsName: (id: string) => string | null
	getTeachersName: (id: string) => string | null
	splitIntoPeriodCards: (item: TimetableItem) => TimetableItem[]
	getClassName?: (id: string) => string | null

}

export function TableToPrint({
	groupName,
	periods,
	weekDates,
	items,
	getSubjectName,
	getClassName,
	getClassroomsName,
	getTeachersName,
	splitIntoPeriodCards,
}: ScheduleTableProps) {
	return (
		<div className='px-10 py-10'>
			<h1 className='text-4xl text-center mb-4'>{groupName}</h1>
			<table className='w-full border-[3px] border-black border-collapse text-lg'>
				<thead>
					<tr>
						<th className='border-[3px] px-2 py-1 text-left text-lg'>День</th>
						{periods.map((period) => (
							<th key={period.number} className='border-[3px] px-2 py-1 text-center'>
								<p className='text-2xl mb-0'>{period.number}</p>({period.start}–{period.end})
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weekDates.map((date) => {
						const dayPeriods: Record<number, TimetableItem[]> = {}

						items.forEach((item) => {
							if (item.date !== date) return
							const splits = splitIntoPeriodCards(item)
							splits.forEach((split) => {
								const p = Number(split.uniperiod)
								if (!dayPeriods[p]) dayPeriods[p] = []
								dayPeriods[p].push(split)
							})
						})

						const dayName = format(parseISO(date), 'EEE', { locale: ru })
						const formattedDate = format(parseISO(date), 'dd.MM')

						return (
							<tr key={date}>
								<td className='border-[3px] px-2 py-1 font-medium text-lg w-[200px]'>
									{dayName.charAt(0).toUpperCase() + dayName.slice(1)}
									<br />
									{formattedDate}
								</td>
								{periods.map((period) => {
									const lessons = dayPeriods[period.number] || []
									lessons.sort((a, b) => a.starttime.localeCompare(b.starttime))
									return (
										<td key={period.number} className='border-[3px] px-2 py-1 align-center w-[20%] h-[200px]'>
											{lessons.map((item, idx) => (
												<div key={idx} className='mb-1 text-center py-4 relative h-full flex items-center justify-center'>

													{getClassName ? (
														<div className='text-xs mt-1'>
															{item.classids.map(getClassName).filter(Boolean).join(', ')}
														</div>
													) : <div className='font-semibold text-lg'>{getSubjectName(item.subjectid)}</div>}
													<div className='text-xs absolute left-0 top-0'>{item.classroomids.map(getClassroomsName).filter(Boolean).join(', ')}</div>
													<div className='text-xs italic absolute right-0 bottom-0'>
														{item.teacherids.map(getTeachersName).filter(Boolean).join(', ')}
													</div>
												</div>
											))}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
