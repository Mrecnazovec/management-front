'use client'

import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/form-element/Input'
import { PUBLIC_URL } from '@/config/url.config'
import { useGetSubjects } from '@/hooks/queries/subjects/useGetSubjects'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { SubjectsBlock } from '../../msu-ek123/subjects/SubjectsBlock'

export function Plan() {
	const combinations = [
		{ courseNumber: '1', semesterNumber: '1' },
		{ courseNumber: '1', semesterNumber: '2' },
		{ courseNumber: '2', semesterNumber: '3' },
		{ courseNumber: '2', semesterNumber: '4' },
		{ courseNumber: '3', semesterNumber: '5' },
		{ courseNumber: '3', semesterNumber: '6' },
		{ courseNumber: '4', semesterNumber: '7' },
		{ courseNumber: '4', semesterNumber: '8' },
	]

	const { subjects, isLoading } = useGetSubjects()
	const [search, setSearch] = useState('')

	const filteredSubjects = useMemo(() => {
		if (!search.trim()) return subjects ?? []
		return subjects?.filter((subject) => subject.title.toLowerCase().includes(search.toLowerCase())) ?? []
	}, [search, subjects])
	return (
		<Container>
			<div>
				<h1 className='text-3xl mb-14' >
					Учебный план
				</h1>
				<Input placeholder='Поиск по названию...' value={search} onChange={(e) => setSearch(e.target.value)} className='mb-6' />
				{search ? (
					<div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4'>
						{filteredSubjects?.map((subject) => (
							<Link key={subject.id} href={PUBLIC_URL.subjects(subject.slug)}>
								<article className='relative aspect-[16/9] rounded-2xl mb-2'>
									<Image src={subject.image} alt={subject.title} fill className='object-cover mb-2 rounded-2xl' />
								</article>
								<p className='line-clamp-2'>{subject.title}</p>
							</Link>
						))}
					</div>
				) : (
					combinations.map((combo) => (
						<SubjectsBlock
							key={`${combo.courseNumber}-${combo.semesterNumber}`}
							courseNumber={combo.courseNumber}
							semesterNumber={combo.semesterNumber}
							isAdmin={false}
						/>
					))
				)}
			</div>
		</Container>
	)
}
