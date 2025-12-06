import { ADMIN_URL } from '@/config/url.config'
import { newService } from '@/services/new.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useDeleteNew() {
	const queryClient = useQueryClient()

	const router = useRouter()

	const { mutate: deleteNew, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['delete new'],
		mutationFn: ({ slug }: { slug: string }) => newService.delete(slug),
		onSuccess(newData) {
			toast.success('Новость удалена')
			queryClient.invalidateQueries({
				queryKey: ['get all news'],
			})
			router.push(ADMIN_URL.news())
		},
		onError() {
			toast.error('Ошибка при удалении новости')
		},
	})

	return useMemo(() => ({ deleteNew, isLoadingDelete }), [deleteNew, isLoadingDelete])
}
