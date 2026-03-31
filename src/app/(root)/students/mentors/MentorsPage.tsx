'use client'

import { PersonsBlock } from '@/components/sections/home/persons-block/PersonsBlock'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/form-element/Input'
import { PUBLIC_URL } from '@/config/url.config'
import { useGetPersonsByRole } from '@/hooks/queries/persons/useGetPersonsByRole'
import AOSComponent from '@/lib/aos'
import { roleTitles } from '@/shared/roleTitles'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export function MentorsPage() {
	const role = 'mentors'
	const { persons, isLoading } = useGetPersonsByRole(role)
	const [search, setSearch] = useState('')

	const filteredPersons = useMemo(() => {
		if (!search.trim()) return persons
		return persons?.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
	}, [search, persons])
	return (
		<AOSComponent>
			<Container>
				<div data-aos='fade-up'>
					<h1 className='text-3xl mb-14'>
						{roleTitles[role]}
					</h1>
					<Input placeholder='Поиск по имени...' value={search} onChange={(e) => setSearch(e.target.value)} className='mb-6' />
					{search ? (
						<div className='grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-4 mb-14'>
							{filteredPersons?.map((person) => (
								<Link key={person.slug} href={PUBLIC_URL.role(role, person?.slug)}>
									<div className='relative overflow-hidden aspect-[3/4] rounded-2xl mb-2'>
										<Image src={person?.photo || ''} fill alt='test' className='object-cover' />
									</div>
									<p>{person?.name}</p>
								</Link>
							))}
						</div>
					) : (
						<PersonsBlock persons={persons} isLoading={isLoading} role={role} />
					)}
				</div>
			</Container>
		</AOSComponent>
	)
}
