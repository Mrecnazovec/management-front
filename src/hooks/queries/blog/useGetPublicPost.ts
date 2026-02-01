import { blogService } from '@/services/blog.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useGetPublicPost() {
	const params = useParams<{ slug: string }>()
	const slug = params?.slug as string

	const { data, isLoading } = useQuery({
		queryKey: ['public blog post', slug],
		queryFn: () => blogService.getPublicPost(slug),
		enabled: !!slug,
	})

	return { post: data, isLoading, slug }
}
