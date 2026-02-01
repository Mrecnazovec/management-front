import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useApprovePost() {
	const queryClient = useQueryClient()

	const { mutate: approvePost, isPending: isLoading } = useMutation({
		mutationKey: ['approve blog post'],
		mutationFn: (id: string) => blogService.approvePost(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			toast.success('Пост одобрен')
		},
		onError() {
			toast.error('Ошибка одобрения')
		},
	})

	return useMemo(() => ({ approvePost, isLoading }), [approvePost, isLoading])
}
