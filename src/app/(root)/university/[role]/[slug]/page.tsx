import { personService } from '@/services/person.service'
import { Metadata, ResolvingMetadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { PUBLIC_URL } from '@/config/url.config'
import { Bread } from '@/components/ui/Breadcrumb/Bread'
import { roleTitles } from '@/shared/roleTitles'
import { PersonBioPage } from './PersonBioPage'
import { stripHtml } from '@/lib/generateDescription'

const STUB_SLUG = '__person_stub__'
const STUB_ROLE = 'mentors'

export async function generateStaticParams() {
	const persons = await personService.getAll()

	if (!persons || persons.length === 0) {
		return [{ role: STUB_ROLE, slug: STUB_SLUG }]
	}

	const params = persons.flatMap((person) =>
		(person.roles || []).map((role) => ({
			role,
			slug: person.slug,
		}))
	)

	if (params.length === 0) {
		return [{ role: STUB_ROLE, slug: STUB_SLUG }]
	}

	return params
}

async function getPerson(slug: string) {
	if (slug === STUB_SLUG) return notFound()

	try {
		return await personService.getOne(slug)
	} catch {
		notFound()
	}
}

type Props = {
	params: Promise<{ slug: string; role: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	'use cache'
	cacheLife({ revalidate: 60 })

	const person = await getPerson((await params).slug)

	return {
		title: person.name,
		description: stripHtml(person.bio),
	}
}

export default async function Page({ params }: Props) {
	'use cache'
	cacheLife({ revalidate: 60 })

	const person = await getPerson((await params).slug)
	const role = (await params).role

	if (!person) return notFound()

	const navigation = [
		{ title: 'Главная', link: PUBLIC_URL.home() },
		{ title: `${role === 'mentors' ? 'Студентам' : 'Университет'}`, link: role === 'mentors' ? PUBLIC_URL.students() : PUBLIC_URL.university() },
		{ title: roleTitles[role], link: PUBLIC_URL.role(role) },
		{ title: person.name },
	]

	return (
		<>
			<Bread navigation={navigation} />
			<PersonBioPage person={person} />
		</>
	)
}
