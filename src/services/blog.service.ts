import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { IBlogPost, IBook } from '@/shared/types/blog.interface'

export class BlogService {
	async getBooks() {
		const { data } = await axiosWithAuth<IBook[]>({
			url: API_URL.adminBooks(),
			method: 'GET',
		})
		return data
	}

	async getBook(id: string) {
		const { data } = await axiosWithAuth<IBook>({
			url: API_URL.adminBooks(id),
			method: 'GET',
		})
		return data
	}

	async updateBook(id: string, payload: Partial<IBook>) {
		const { data } = await axiosWithAuth<IBook>({
			url: API_URL.adminBooks(id),
			method: 'PATCH',
			data: payload,
		})
		return data
	}

	async deleteBook(id: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminBooks(id),
			method: 'DELETE',
		})
		return data
	}

	async importBook(file: File, sourceUrl?: string, bookId?: string) {
		const formData = new FormData()
		formData.append('file', file)
		if (sourceUrl) {
			formData.append('sourceUrl', sourceUrl)
		}
		if (bookId) {
			formData.append('bookId', bookId)
		}
		const { data } = await axiosWithAuth({
			url: API_URL.adminBooks(`import`),
			method: 'POST',
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return data
	}

	async uploadSource(file: File) {
		const formData = new FormData()
		formData.append('file', file)
		const { data } = await axiosWithAuth<{ url: string }>({
			url: API_URL.adminBooks('upload-source'),
			method: 'POST',
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return data
	}

	async getSettings() {
		const { data } = await axiosWithAuth<{ autoPublish: boolean }>({
			url: API_URL.adminBlogSettings(),
			method: 'GET',
		})
		return data
	}

	async updateSettings(payload: { autoPublish: boolean }) {
		const { data } = await axiosWithAuth<{ autoPublish: boolean }>({
			url: API_URL.adminBlogSettings(),
			method: 'PATCH',
			data: payload,
		})
		return data
	}

	async getPosts(params?: { status?: string; rubric?: string; bookId?: string; page?: number; limit?: number }) {
		const query = new URLSearchParams()
		if (params?.status) query.set('status', params.status)
		if (params?.rubric) query.set('rubric', params.rubric)
		if (params?.bookId) query.set('bookId', params.bookId)
		if (params?.page) query.set('page', String(params.page))
		if (params?.limit) query.set('limit', String(params.limit))
		const suffix = query.toString() ? `?${query.toString()}` : ''

		const { data } = await axiosWithAuth<{ items: IBlogPost[]; total: number; page: number; limit: number }>({
			url: API_URL.adminPosts(`${suffix}`),
			method: 'GET',
		})
		return data
	}

	async getPost(id: string) {
		const { data } = await axiosWithAuth<IBlogPost>({
			url: API_URL.adminPosts(id),
			method: 'GET',
		})
		return data
	}

	async updatePost(id: string, payload: Partial<IBlogPost>) {
		const { data } = await axiosWithAuth<IBlogPost>({
			url: API_URL.adminPosts(id),
			method: 'PATCH',
			data: payload,
		})
		return data
	}

	async approvePost(id: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminPosts(`${id}/approve`),
			method: 'POST',
		})
		return data
	}

	async rejectPost(id: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminPosts(`${id}/reject`),
			method: 'POST',
		})
		return data
	}

	async schedulePost(id: string, scheduledAt: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminPosts(`${id}/schedule`),
			method: 'POST',
			data: { scheduledAt },
		})
		return data
	}

	async publishNow(id: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminPosts(`${id}/publishNow`),
			method: 'POST',
		})
		return data
	}

	async retryTelegram(id: string) {
		const { data } = await axiosWithAuth({
			url: API_URL.adminPosts(`${id}/retryTelegram`),
			method: 'POST',
		})
		return data
	}

	async getPublicPosts(limit?: number) {
		const { data } = await axiosClassic<IBlogPost[]>({
			url: API_URL.blog(limit ? `?limit=${limit}` : ''),
			method: 'GET',
		})
		return data
	}

	async getPublicPost(slug: string) {
		const { data } = await axiosClassic<IBlogPost>({
			url: API_URL.blog(slug),
			method: 'GET',
		})
		return data
	}
}

export const blogService = new BlogService()
