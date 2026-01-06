import { getEndOfWeek, getStartOfWeek } from '@/lib/eduPageGetDate'
import { eduPageService } from '@/services/edupage.service'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export const useGetEduPageData = (enabled = true) => {
	const searchParams = useSearchParams()
	const datefrom = searchParams.get('datefrom') ?? getStartOfWeek()
	const dateto = searchParams.get('dateto') ?? getEndOfWeek()

	const { data, isLoading } = useQuery({
		queryKey: ['get eduPage data', datefrom, dateto],
		queryFn: () => {
			return eduPageService.getDataBase(datefrom, dateto)
		},
		enabled,
	})

	return useMemo(
		() => ({
			eduPageData: data,
			isLoading,
		}),
		[data, isLoading]
	)
}
