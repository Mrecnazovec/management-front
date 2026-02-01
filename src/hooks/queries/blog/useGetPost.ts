import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useGetPost() {
	const params = useParams<{ id: string }>()
	const postId = params?.id as string

	const { data, isLoading } = useQuery({
		queryKey: ['blog post', postId],
		queryFn: () => blogService.getPost(postId),
		enabled: !!postId,
	})

	return { post: data, isLoading, postId }
}
