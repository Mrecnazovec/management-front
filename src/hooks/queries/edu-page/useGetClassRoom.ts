import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { eduPageService } from '@/services/edupage.service'
import { EduPageTimeTable } from '@/shared/types/edu-page-timetable.interface'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetClassRoom = (id?: string) => {
	const searchParams = useSearchParams()
	const datefrom = searchParams.get('datefrom') ?? getStartOfWeek()
	const dateto = searchParams.get('dateto') ?? getEndOfWeek()

	const { data, isLoading } = useQuery({
		queryKey: ['get eduPage classRoom', datefrom, dateto, id],
		queryFn: async () => {
			if (!id) return null
			return await eduPageService.getClassRooms(datefrom, dateto, id)
		},
		enabled: !!id,
	})

	return useMemo(() => ({ classRoom: data, isLoading }), [data, isLoading])
}
