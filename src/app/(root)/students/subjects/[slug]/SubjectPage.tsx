import { Container } from '@/components/ui/Container'
import { ADMIN_URL, PUBLIC_URL } from '@/config/url.config'
import AOSComponent from '@/lib/aos'
import { ISubject } from '@/shared/types/subject.interface'
import { CalendarCheck, BookOpenCheck, ListOrdered, ArrowUp01 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
	subject: ISubject
}

const InfoItem = ({ icon: Icon, label, value }: { icon: typeof CalendarCheck; label: string; value: string | number | (string | number)[] }) => {
	const formattedValue = Array.isArray(value) ? value.join(', ') : value

	return (
		<div className='flex flex-col items-center justify-center text-center gap-1 shadow rounded-2xl p-4'>
			<Icon className='size-10 text-primary' />
			<p className='text-sm text-muted-foreground'>{label}</p>
			<p className='font-medium'>{formattedValue}</p>
		</div>
	)
}

export function SubjectPage({ subject }: Props) {
	return (
		<AOSComponent>
			<Container>
				<div data-aos='fade-up'>
					<h1 className='text-3xl mb-10'>{subject.title}</h1>

					<div className='grid lg:grid-cols-2 gap-8 mb-14'>
						<div className='relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md'>
							<Image
								src={subject.image}
								alt={`Изображение предмета ${subject.title}`}
								fill
								className='object-cover'
								sizes='(max-width: 768px) 100vw, 50vw'
								priority
							/>
						</div>

						<div className='grid grid-cols-2 xs:gap-8 gap-4'>
							<InfoItem icon={CalendarCheck} label='Длительность' value={subject.duration} />
							<InfoItem icon={BookOpenCheck} label='Итог' value={subject.result} />
							<InfoItem icon={ListOrdered} label='Курс' value={subject.courseNumbers} />
							<InfoItem icon={ArrowUp01} label='Семестр' value={subject.semesterNumbers} />
						</div>
					</div>

					<div className='mb-14'>
						<h2 className='text-2xl font-semibold'>Описание:</h2>
						<div className='prose prose-lg max-w-none' dangerouslySetInnerHTML={{ __html: subject.description }} />
					</div>

					{subject.teachers.length > 0 && (
						<div>
							<h2 className='text-2xl font-semibold mb-4'>Преподаватели:</h2>
							<div className='grid lg:grid-cols-6 xs:grid-cols-3 grid-cols-2 gap-6'>
								{subject.teachers?.map((teacher) => (
									<Link key={teacher.id} href={PUBLIC_URL.role('teachers', teacher.slug)}>
										<article className='relative aspect-[3/4] rounded-2xl mb-2'>
											<Image src={teacher.photo} alt={teacher.name} fill className='object-cover mb-2 rounded-2xl' />
										</article>
										<p className='line-clamp-2'>{teacher.name}</p>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</Container>
		</AOSComponent>
	)
}
