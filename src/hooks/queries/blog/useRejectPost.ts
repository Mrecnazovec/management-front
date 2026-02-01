import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useRejectPost() {
	const queryClient = useQueryClient()

	const { mutate: rejectPost, isPending: isLoading } = useMutation({
		mutationKey: ['reject blog post'],
		mutationFn: (id: string) => blogService.rejectPost(id),
		onSuccess() {
			toast.success('Пост отклонён')
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			queryClient.invalidateQueries({ queryKey: ['blog post'] })
		},
		onError() {
			toast.error('Ошибка при отклонении поста')
		},
	})

	return useMemo(() => ({ rejectPost, isLoading }), [rejectPost, isLoading])
}
