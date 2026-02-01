import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'

export function useGetPublicPosts(limit?: number) {
	const { data, isLoading } = useQuery({
		queryKey: ['public blog posts', limit],
		queryFn: () => blogService.getPublicPosts(limit),
	})

	return { posts: data, isLoading }
}
