import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { INew, INewForm } from '@/shared/types/new.interface'

class NewService {
	async getAll(params?: { limit?: number; page?: number }) {
		const query = new URLSearchParams()
		if (params?.limit) query.set('limit', String(params.limit))
		if (params?.page) query.set('page', String(params.page))
		const suffix = query.toString() ? `?${query.toString()}` : ''

		const { data } = await axiosClassic<{ items: INew[]; total: number; page: number; limit: number }>({
			url: API_URL.news(`${suffix}`),
			method: 'GET',
		})

		return data
	}

	async getTopNews() {
		const { data } = await axiosClassic<INew[]>({
			url: API_URL.news('top'),
			method: 'GET',
		})

		return data
	}

	async getBySlug(slug: string) {
		const { data } = await axiosClassic<INew>({
			url: API_URL.news(`by-slug/${slug}`),
			method: 'GET',
		})

		return data
	}

	async create(data: INewForm) {
		const { data: createdNew } = await axiosWithAuth<INew>({
			url: API_URL.news(),
			method: 'POST',
			data: this.preparePayload(data),
		})

		return createdNew
	}
	async update(slug: string, data: INewForm) {
		const { data: updatedNew } = await axiosWithAuth<INew>({
			url: API_URL.news(slug),
			method: 'PUT',
			data: this.preparePayload(data),
		})

		return updatedNew
	}

	async delete(slug: string) {
		const { data: deletedNew } = await axiosWithAuth<INew>({
			url: API_URL.news(slug),
			method: 'DELETE',
		})

		return deletedNew
	}

	private preparePayload(data: INewForm) {
		const { createdAt, ...rest } = data

		if (!createdAt) return rest

		return {
			...rest,
			createdAt:
				createdAt instanceof Date
					? createdAt.toISOString()
					: createdAt,
		}
	}
}
export const newService = new NewService()
