'use client'

import Cookies from 'js-cookie'
import { TableToPrint } from '../toPrint/TableToPrint'

interface PDFPrintAreaProps {
	tablesToShow: any[]
	groupIds: string[]
	eduPageData: any
	periods: { number: number; start: string; end: string }[]
	allClassRooms: {
		id: string;
		name: string;
		short: string;
	}[]
	weekDates: string[]
	getSubjectName: (id: string) => string | null
	getClassroomsName: (id: string) => string | null
	getTeachersName: (id: string) => string | null
	splitIntoPeriodCards: (item: any) => any[]
	getClassName?: (id: string) => string | null

}

export default function PDFPrintArea({
	tablesToShow,
	groupIds,
	eduPageData,
	allClassRooms,
	periods,
	weekDates,
	getSubjectName,
	getClassName,
	getClassroomsName,
	getTeachersName,
	splitIntoPeriodCards,
}: PDFPrintAreaProps) {
	const myGroupId = Cookies.get('selected_classroom_id') ?? '-143'

	return (
		<div
			id='pdf-print-area'
			style={{
				position: 'absolute',
				top: '-9999px',
				left: '-9999px',
				width: '1920px',
				padding: '16px',
			}}
		>
			{tablesToShow.map((tableData, index) => {
				const items = tableData?.r.ttitems ?? []
				const classId = myGroupId !== 'all' ? myGroupId : groupIds[index]
				const groupName =
					allClassRooms.find((r) => r.id === classId)?.short || 'Аудитория'

				return (
					<TableToPrint
						key={index}
						groupName={groupName}
						periods={periods}
						weekDates={weekDates}
						items={items}
						getSubjectName={getClassroomsName}
						getClassroomsName={getClassroomsName}
						getTeachersName={getTeachersName}
						splitIntoPeriodCards={splitIntoPeriodCards}
						getClassName={getClassName}
					/>
				)
			})}
		</div>
	)
}
