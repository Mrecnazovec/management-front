import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { eduPageService } from '@/services/edupage.service'
import { EduPageTimeTable } from '@/shared/types/edu-page-timetable.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const allGroupIds = ['-143', '-144', '-141', '-142']

export const useGetAllEduPageTimeTables = (ids: string[], enabled = true) => {
	const searchParams = useSearchParams()
	const datefrom = searchParams.get('datefrom') ?? getStartOfWeek()
	const dateto = searchParams.get('dateto') ?? getEndOfWeek()

	const queries = ids.map((id) => ({
		queryKey: ['get eduPage TimeTable', datefrom, dateto, id],
		queryFn: () => eduPageService.getTimeTable(datefrom, dateto, id),
		enabled,
	}))

	const results = queries.map((query) => useQuery(query))

	const isLoading = results.some((res) => res.isLoading)
	const data = results.map((res) => res.data).filter((d): d is EduPageTimeTable => !!d)

	return useMemo(() => ({ timeTables: data, isLoading }), [data, isLoading])
}
