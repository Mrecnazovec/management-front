import { newService } from '@/services/new.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useGetNews = (params?: { limit?: number; page?: number }) => {
	const { data: posts, isLoading } = useQuery({
		queryKey: ['get all news', params],
		queryFn: () => newService.getAll(params),
	})

	return useMemo(() => ({ posts, isLoading }), [posts, isLoading])
}
