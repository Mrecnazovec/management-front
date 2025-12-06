import { ADMIN_URL } from '@/config/url.config'
import { newService } from '@/services/new.service'
import { INewForm } from '@/shared/types/new.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useUpdateNew() {
	const queryClient = useQueryClient()

	const router = useRouter()

	const { mutate: updateNew, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update new'],
		mutationFn: ({ slug, data }: { slug: string; data: INewForm }) => newService.update(slug, data),
		onSuccess(newData) {
			queryClient.invalidateQueries({
				queryKey: ['get all news'],
			})
			toast.success('Новость обновлена')
			router.push(ADMIN_URL.news())
		},
		onError() {
			toast.error('Ошибка при обновлении новости')
		},
	})

	return useMemo(() => ({ updateNew, isLoadingUpdate }), [updateNew, isLoadingUpdate])
}
