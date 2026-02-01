export const APP_URL = process.env.APP_URL as string

export const PUBLIC_URL = {
	root: (url = '') => `${url ? url : ''}`,

	home: () => PUBLIC_URL.root('/'),
	applicant: (url = '') => PUBLIC_URL.root(`/applicant${url ? url : ''}`),
	contacts: () => PUBLIC_URL.root(`/applicant/contacts`),
	university: (url = '') => PUBLIC_URL.root(`/university/${url ? url : ''}`),
	role: (role = '', url = '') => PUBLIC_URL.root(`/${role === 'mentors' ? 'students' : 'university'}/${role}/${url ? url : ''}`),
	news: (url = '') => PUBLIC_URL.root(`/university/news/${url ? url : ''}`),
	blog: (url = '') => PUBLIC_URL.root(`/blog/${url ? url : ''}`),
	blogBookDownload: (id: string) => PUBLIC_URL.root(`/blog/books/${id}/download`),
	students: (url = '') => PUBLIC_URL.root(`/students/${url ? url : ''}`),
	timetable: (url = '') => PUBLIC_URL.root(`/students/timetable/${url ? url : ''}`),
	subjects: (url = '') => PUBLIC_URL.root(`/students/subjects/${url ? url : ''}`),
	agreement: (url = '') => PUBLIC_URL.root(`/PDPAgreement/${url ? url : ''}`),
}

export const ADMIN_URL = {
	root: (url = '') => `/msu-ek123${url ? url : ''}`,
	auth: (url = '') => `/control-msu-ek123${url ? url : ''}`,

	home: () => ADMIN_URL.root('/'),
	news: (url = '') => ADMIN_URL.root(`/news/${url}`),
	blog: (url = '') => ADMIN_URL.root(`/blog/${url}`),
	administration: (url = '') => ADMIN_URL.root(`/administration/${url}`),
	teachers: (url = '') => ADMIN_URL.root(`/teachers/${url}`),
	union: (url = '') => ADMIN_URL.root(`/union/${url}`),
	mentors: (url = '') => ADMIN_URL.root(`/mentors/${url}`),
	subjects: (url = '') => ADMIN_URL.root(`/subjects/${url}`),
	moderators: (url = '') => ADMIN_URL.root(`/moderators/${url}`),
	role: (role = '', url = '') => ADMIN_URL.root(`/${role}/${url}`),
}

export const PATH_URL = {
	root: (url = '') => `${url ? url : ''}`,

	jpg: (filename = '') => PATH_URL.root(`/jpg/${filename ? filename : ''}`),
	png: (filename = '') => PATH_URL.root(`/png/${filename ? filename : ''}`),
	svg: (filename = '') => PATH_URL.root(`/svg/${filename ? filename : ''}`),
	pdf: (filename = '') => PATH_URL.root(`/pdf/${filename ? filename : ''}`),
	doc: (filename = '') => PATH_URL.root(`/doc/${filename ? filename : ''}`),
}
