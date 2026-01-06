export const SERVER_URL = process.env.SERVER_URL as string

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	auth: (url = '') => API_URL.root(`/auth/${url}`),
	users: (url = '') => API_URL.root(`/users/${url}`),
	subjects: (url = '') => API_URL.root(`/subjects/${url}`),
	persons: (url = '') => API_URL.root(`/persons/${url}`),
	files: (url = '') => API_URL.root(`/files/${url}`),
	news: (url = '') => API_URL.root(`/news/${url}`),
	getNews: (limit?: number) => API_URL.root(`/news?limit=${limit}`),

	edupage: (url = '') => API_URL.root(`/edupage/${url}`),
	fetch: (datefrom = '', dateto = '') => API_URL.root(`/edupage/fetch?datefrom=${datefrom}&dateto=${dateto}`),
	timetable: (datefrom = '', dateto = '', id = '') => API_URL.root(`/edupage/timetable?datefrom=${datefrom}&dateto=${dateto}&id=${id}`),
	classrooms: (datefrom = '', dateto = '', id = '') => API_URL.root(`/edupage/classrooms?datefrom=${datefrom}&dateto=${dateto}&id=${id}`),
	timetableImage: (datefrom = '', dateto = '', id = '') =>
		API_URL.root(`/edupage/timetable-image?datefrom=${datefrom}&dateto=${dateto}&id=${id}`),
	timetableImages: (datefrom = '', dateto = '', ids = '') =>
		API_URL.root(`/edupage/timetable-images?datefrom=${datefrom}&dateto=${dateto}&ids=${ids}`),
	timetableImagesData: (datefrom = '', dateto = '', ids = '') =>
		API_URL.root(`/edupage/timetable-images-data?datefrom=${datefrom}&dateto=${dateto}&ids=${ids}`),

	telegram: () => API_URL.root(`/telegram/send`),
}
