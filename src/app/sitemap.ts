import { newService } from '@/services/new.service'
import { personService } from '@/services/person.service'
import { subjectService } from '@/services/subject.service'
import type { MetadataRoute } from 'next'

export async function getNews(): Promise<{ slug: string }[]> {
	const response = await newService.getAll({ limit: 500, page: 1 })
	return response?.items ?? []
}

export async function getMentors(): Promise<{ slug: string }[]> {
	const mentors = await personService.getByRole('mentors')
	return mentors
}

export async function getTeachers(): Promise<{ slug: string }[]> {
	const teachers = await personService.getByRole('teachers')
	return teachers
}

export async function getAdministration(): Promise<{ slug: string }[]> {
	const administration = await personService.getByRole('administration')
	return administration
}

export async function getUnion(): Promise<{ slug: string }[]> {
	const union = await personService.getByRole('union')
	return union
}

export async function getSubjects(): Promise<{ slug: string }[]> {
	const unions = await subjectService.getAll()
	return unions
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [news, mentors, teachers, administration, union, subjects] = await Promise.all([
		getNews(),
		getMentors(),
		getTeachers(),
		getAdministration(),
		getUnion(),
		getSubjects(),
	])

	return [
		{
			url: 'https://msu-management.uz',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: 'https://msu-management.uz/applicant',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://msu-management.uz/students',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://msu-management.uz/students/subjects',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/students/mentors',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/university',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://msu-management.uz/university/administration',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/university/teachers',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/university/union',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/university/news',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://msu-management.uz/PDagreement',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		...news.map((post) => ({
			url: `https://msu-management.uz/university/news/${post.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
		...mentors.map((mentor) => ({
			url: `https://msu-management.uz/students/mentors/${mentor.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
		...teachers.map((teacher) => ({
			url: `https://msu-management.uz/university/teachers/${teacher.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
		...administration.map((person) => ({
			url: `https://msu-management.uz/university/administration/${person.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
		...union.map((person) => ({
			url: `https://msu-management.uz/university/union/${person.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
		...subjects.map((subject) => ({
			url: `https://msu-management.uz/students/subjects/${subject.slug}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.5,
		})),
	]
}
