import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

type ImportPayload = { file: File; sourceUrl?: string; bookId?: string }

export function useImportBook() {
	const queryClient = useQueryClient()

	const { mutate: importBook, isPending: isLoading } = useMutation({
		mutationKey: ['import book'],
		mutationFn: ({ file, sourceUrl, bookId }: ImportPayload) => blogService.importBook(file, sourceUrl, bookId),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['blog books'] })
			toast.success('Книга импортирована')
		},
		onError() {
			toast.error('Ошибка импорта книги')
		},
	})

	return useMemo(() => ({ importBook, isLoading }), [importBook, isLoading])
}
