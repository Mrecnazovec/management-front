import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useSchedulePost() {
	const queryClient = useQueryClient()

	const { mutate: schedulePost, isPending: isLoading } = useMutation({
		mutationKey: ['schedule blog post'],
		mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) => blogService.schedulePost(id, scheduledAt),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			toast.success('Пост запланирован')
		},
		onError() {
			toast.error('Ошибка планирования')
		},
	})

	return useMemo(() => ({ schedulePost, isLoading }), [schedulePost, isLoading])
}
