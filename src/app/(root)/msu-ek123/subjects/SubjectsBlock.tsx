'use client'

import { useGetSubjectsByCourse } from '@/hooks/queries/subjects/useGetSubjectsByCourse'
import Image from 'next/image'
import Link from 'next/link'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import AOSComponent from '@/lib/aos'

type Props = {
	courseNumber: string
	semesterNumber: string
	isAdmin: boolean
}

export const SubjectsBlock = ({ courseNumber, semesterNumber, isAdmin }: Props) => {
	const { subjects, isLoading } = useGetSubjectsByCourse({ courseNumber, semesterNumber })

	return (
		<div className='mb-10'>
			<h2 className='text-xl font-semibold mb-4'>
				{courseNumber} курс, {semesterNumber} семестр
			</h2>
			<div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4'>
				<AOSComponent>
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className='animate-pulse'>
									<div className='bg-gray-300 rounded-2xl w-full aspect-[16/9]' />
									<div className='h-4 bg-gray-300 mt-2 rounded w-full' />
									<div className='h-4 bg-gray-300 mt-1 rounded w-3/4' />
								</div>
						  ))
						: subjects?.map((subject, index) => (
								<Link key={subject.id} href={isAdmin ? ADMIN_URL.subjects(subject.slug) : PUBLIC_URL.subjects(subject.slug)} data-aos='fade-up'>
									<article className='relative aspect-[16/9] rounded-2xl mb-2'>
										<Image src={subject.image} alt={subject.title} fill className='object-cover mb-2 rounded-2xl' />
									</article>
									<p className='line-clamp-2'>{subject.title}</p>
								</Link>
						  ))}
				</AOSComponent>
			</div>
		</div>
	)
}
