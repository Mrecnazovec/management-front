import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useRetryTelegram() {
	const queryClient = useQueryClient()

	const { mutate: retryTelegram, isPending: isLoading } = useMutation({
		mutationKey: ['retry blog telegram'],
		mutationFn: (id: string) => blogService.retryTelegram(id),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog posts'] })
			toast.success('Повторная отправка выполнена')
		},
		onError() {
			toast.error('Ошибка отправки в Telegram')
		},
	})

	return useMemo(() => ({ retryTelegram, isLoading }), [retryTelegram, isLoading])
}
