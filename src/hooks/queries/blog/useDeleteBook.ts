import { ADMIN_URL } from '@/config/url.config'
import { blogService } from '@/services/blog.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export function useDeleteBook() {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: deleteBook, isPending: isLoading } = useMutation({
		mutationKey: ['delete blog book'],
		mutationFn: ({ id }: { id: string }) => blogService.deleteBook(id),
		onSuccess() {
			toast.success('Книга удалена')
			queryClient.invalidateQueries({ queryKey: ['blog books'] })
			router.push(ADMIN_URL.blog())
		},
		onError() {
			toast.error('Ошибка при удалении книги')
		},
	})

	return useMemo(() => ({ deleteBook, isLoading }), [deleteBook, isLoading])
}
