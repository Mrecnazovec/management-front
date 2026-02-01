import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function usePublishPost() {
	const queryClient = useQueryClient()

	const { mutate: publishPost, isPending: isLoading } = useMutation({
		mutationKey: ['publish blog post'],
		mutationFn: (id: string) => blogService.publishNow(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			toast.success('Пост опубликован')
		},
		onError() {
			toast.error('Ошибка публикации')
		},
	})

	return useMemo(() => ({ publishPost, isLoading }), [publishPost, isLoading])
}
