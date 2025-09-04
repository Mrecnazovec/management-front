'use client'

import Cookies from 'js-cookie'
import { useEffect, useMemo, useState } from 'react'
import { TableToPrint } from './TableToPrint'

interface PDFPrintAreaProps {
	tablesToShow: any[]
	groupIds: string[]
	eduPageData: any
	periods: { number: number; start: string; end: string }[]
	weekDates: string[]
	getSubjectName: (id: string) => string | null
	getClassroomsName: (id: string) => string | null
	getTeachersName: (id: string) => string | null
	splitIntoPeriodCards: (item: any) => any[]
}

export default function PDFPrintArea({
	tablesToShow,
	groupIds,
	eduPageData,
	periods,
	weekDates,
	getSubjectName,
	getClassroomsName,
	getTeachersName,
	splitIntoPeriodCards,
}: PDFPrintAreaProps) {
	const myGroupId = Cookies.get('group_id') ?? '-143'

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
					eduPageData?.r.tables.find((s: any) => s.id === 'classes')?.data_rows?.find((r: any) => r.id === classId)?.name ?? `Группа ${classId}`

				return (
					<TableToPrint
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
			})}
		</div>
	)
}
