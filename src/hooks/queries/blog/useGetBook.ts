import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useGetBook() {
	const params = useParams<{ bookId: string }>()
	const bookId = params?.bookId as string

	const { data, isLoading } = useQuery({
		queryKey: ['blog book', bookId],
		queryFn: () => blogService.getBook(bookId),
		enabled: !!bookId,
	})

	return { book: data, isLoading, bookId }
}
