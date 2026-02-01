import { blogService } from '@/services/blog.service'
import { IBlogPost } from '@/shared/types/blog.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useUpdatePost() {
	const queryClient = useQueryClient()

	const { mutate: updatePost, isPending: isLoading } = useMutation({
		mutationKey: ['update blog post'],
		mutationFn: ({ id, data }: { id: string; data: Partial<IBlogPost> }) => blogService.updatePost(id, data),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			queryClient.invalidateQueries({ queryKey: ['blog post', variables.id] })
			toast.success('Пост обновлён')
		},
		onError() {
			toast.error('Ошибка обновления поста')
		},
	})

	return useMemo(() => ({ updatePost, isLoading }), [updatePost, isLoading])
}
