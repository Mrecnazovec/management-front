import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'

export function useGetBooks() {
	const { data, isLoading } = useQuery({
		queryKey: ['blog books'],
		queryFn: () => blogService.getBooks(),
	})

	return { books: data, isLoading }
}
