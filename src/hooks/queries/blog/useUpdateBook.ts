import { blogService } from '@/services/blog.service'
import { IBook } from '@/shared/types/blog.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useUpdateBook() {
	const queryClient = useQueryClient()

	const { mutate: updateBook, isPending: isLoading } = useMutation({
		mutationKey: ['update blog book'],
		mutationFn: ({ id, data }: { id: string; data: Partial<IBook> }) => blogService.updateBook(id, data),
		onSuccess(_, variables) {
			queryClient.invalidateQueries({ queryKey: ['blog books'] })
			queryClient.invalidateQueries({ queryKey: ['blog book', variables.id] })
			toast.success('Книга обновлена')
		},
		onError() {
			toast.error('Ошибка обновления книги')
		},
	})

	return useMemo(() => ({ updateBook, isLoading }), [updateBook, isLoading])
}
