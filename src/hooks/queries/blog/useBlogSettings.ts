import { blogService } from '@/services/blog.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useBlogSettings() {
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['blog settings'],
		queryFn: () => blogService.getSettings(),
	})

	const { mutate: updateSettings, isPending: isSaving } = useMutation({
		mutationKey: ['update blog settings'],
		mutationFn: (payload: { autoPublish: boolean }) => blogService.updateSettings(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog settings'] })
			toast.success('Настройки сохранены')
		},
		onError() {
			toast.error('Ошибка сохранения настроек')
		},
	})

	return useMemo(
		() => ({ settings: data, isLoading, updateSettings, isSaving }),
		[data, isLoading, updateSettings, isSaving],
	)
}
