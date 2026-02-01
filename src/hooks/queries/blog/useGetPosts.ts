import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'

export function useGetPosts(params?: { status?: string; rubric?: string; bookId?: string; page?: number; limit?: number }) {
	const { data, isLoading } = useQuery({
		queryKey: ['blog posts', params],
		queryFn: () => blogService.getPosts(params),
	})

	return { posts: data, isLoading }
}
