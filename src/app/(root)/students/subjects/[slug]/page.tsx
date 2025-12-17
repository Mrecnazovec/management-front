import { subjectService } from '@/services/subject.service'
import { Metadata, ResolvingMetadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { SubjectPage } from './SubjectPage'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { stripHtml } from '@/lib/generateDescription'

export async function generateStaticParams() {
	const subjects = await subjectService.getAll()

	return subjects.map((subject) => ({
		slug: subject.slug,
	}))
}

async function getSubject(slug: string) {
	try {
		return await subjectService.getOne(slug)
	} catch {
		notFound()
	}
}

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	'use cache'
	cacheLife({ revalidate: 60 })

	const subject = await getSubject((await params).slug)

	return {
		title: subject.title,
		description: stripHtml(subject.description),
	}
}

export default async function Page({ params }: Props) {
	'use cache'
	cacheLife({ revalidate: 60 })

	const subject = await getSubject((await params).slug)

	if (!subject) return notFound()

	const navigation = [
		{ title: 'Главная', link: PUBLIC_URL.home() },
		{ title: 'Студентам', link: PUBLIC_URL.students() },
		{ title: 'Предметы', link: PUBLIC_URL.subjects() },
		{ title: subject.title },
	]

	return (
		<>
			<Bread navigation={navigation} />
			<SubjectPage subject={subject} />
		</>
	)
}
