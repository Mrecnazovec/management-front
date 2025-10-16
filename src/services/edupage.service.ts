import { axiosClassic } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { EduPageData } from '@/shared/types/edu-page-data.interface'
import { EduPageTimeTable } from '@/shared/types/edu-page-timetable.interface'

class EduPageService {
	async getDataBase(datefrom: string, dateto: string) {
		const { data } = await axiosClassic<EduPageData>({
			url: API_URL.fetch(datefrom, dateto),
			method: 'GET',
		})

		return data
	}

	async getTimeTable(datefrom: string, dateto: string, id: string) {
		const { data } = await axiosClassic<EduPageTimeTable>({
			url: API_URL.timetable(datefrom, dateto, id),
			method: 'GET',
		})

		return data
	}

	async getClassRooms(datefrom: string, dateto: string, id: string) {
		const { data } = await axiosClassic<EduPageTimeTable>({
			url: API_URL.classrooms(datefrom, dateto, id),
			method: 'GET',
		})

		return data
	}
}

export const eduPageService = new EduPageService()
