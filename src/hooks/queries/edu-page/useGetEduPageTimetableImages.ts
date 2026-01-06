import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { eduPageService } from '@/services/edupage.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const emptyImages: { id: string; url: string }[] = []

export const useGetEduPageTimetableImages = (ids: string[], enabled = true) => {
	const searchParams = useSearchParams()
	const datefrom = searchParams.get('datefrom') ?? getStartOfWeek()
	const dateto = searchParams.get('dateto') ?? getEndOfWeek()
	const idsKey = ids.join(',')

	const query = useQuery({
		queryKey: ['get eduPage timetable images', datefrom, dateto, idsKey],
		queryFn: () => eduPageService.getTimetableImages(datefrom, dateto, ids),
		enabled: enabled && ids.length > 0,
	})

	const images = query.data?.images ?? emptyImages

	return useMemo(
		() => ({ images, isLoading: query.isLoading }),
		[images, query.isLoading],
	)
}
