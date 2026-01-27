import { axiosClassic } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.config'
import { EduPageClassroomsWithSubjects } from '@/shared/types/edu-page-classrooms-with-subjects.interface'
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

	async getClassroomsWithSubjects(datefrom: string, dateto: string) {
		const { data } = await axiosClassic<EduPageClassroomsWithSubjects>({
			url: API_URL.classroomsWithSubjects(datefrom, dateto),
			method: 'GET',
		})

		return data
	}

	async getTimetableImage(datefrom: string, dateto: string, id: string) {
		const { data } = await axiosClassic<{ id: string; url: string }>({
			url: API_URL.timetableImage(datefrom, dateto, id),
			method: 'GET',
		})

		return data
	}

	async getTimetableImages(datefrom: string, dateto: string, ids: string[]) {
		const { data } = await axiosClassic<{ images: { id: string; url: string }[] }>({
			url: API_URL.timetableImages(datefrom, dateto, ids.join(',')),
			method: 'GET',
		})

		return data
	}

	async getTimetableImagesData(datefrom: string, dateto: string, ids: string[]) {
		const { data } = await axiosClassic<{ images: { id: string; dataUrl: string }[] }>({
			url: API_URL.timetableImagesData(datefrom, dateto, ids.join(',')),
			method: 'GET',
		})

		return data
	}
}

export const eduPageService = new EduPageService()
