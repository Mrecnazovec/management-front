'use client'

import { AdministrationIcon } from '@/components/icons/AdministrationIcon'
import { MentorsIcon } from '@/components/icons/MentorsIcon'
import { ModeratorsIcon } from '@/components/icons/ModeratorsIcon'
import { NewsIcon } from '@/components/icons/NewsIcon'
import { SubjectsIcon } from '@/components/icons/SubjectsIcon'
import { TeachersIcon } from '@/components/icons/TeachersIcon'
import { UnionIcon } from '@/components/icons/UnionIcon'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'
import { ADMIN_URL, PATH_URL } from '@/config/url.config'
import { useLogout } from '@/hooks/useLogout'
import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'

export function AdminPage() {
	const { user, isLoading } = useProfile()
	const { logout } = useLogout()

	const navigation = [
		{
			href: ADMIN_URL.news(),
			image: <NewsIcon />,
			title: 'Новости',
		},
		{
			href: ADMIN_URL.administration(),
			image: <AdministrationIcon />,
			title: 'Руководство',
		},
		{
			href: ADMIN_URL.teachers(),
			image: <TeachersIcon />,
			title: 'Преподаватели',
		},
		{
			href: ADMIN_URL.union(),
			image: <UnionIcon />,
			title: 'Студ. совет',
		},
		{
			href: ADMIN_URL.mentors(),
			image: <MentorsIcon />,
			title: 'Менторы',
		},
		{
			href: ADMIN_URL.subjects(),
			image: <SubjectsIcon />,
			title: 'Предметы',
		},
		...(user?.role === 'admin'
			? [
					{
						href: ADMIN_URL.moderators(),
						image: <ModeratorsIcon />,
						title: 'Модераторы',
					},
			  ]
			: []),
	]

	return (
		<>
			{isLoading ? (
				<Container>
					<div className='flex items-center justify-between gap-4 mb-14'>
						<Skeleton className='h-10 w-48 rounded-lg' />
						<Skeleton className='h-10 w-24 rounded-lg' />
					</div>
					<div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
						{Array.from({ length: 7 }).map((_, index) => (
							<div key={index}>
								<Skeleton className='w-full aspect-[4/2] rounded-2xl' />
								<Skeleton className='h-6 w-32 mx-auto mt-2 rounded-md' />
							</div>
						))}
					</div>
				</Container>
			) : (
				<Container>
					<div className='flex items-center justify-between gap-4 mb-14'>
						<h1 className='text-3xl'>{user?.name}</h1>
						<Button variant='main' className='group relative overflow-hidden' onClick={() => logout()}>
							<span className='transition-opacity duration-200 group-hover:opacity-0'>{user?.role === 'admin' ? 'Админ' : 'Модератор'}</span>
							<span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
								Выйти
							</span>
						</Button>
					</div>
					<div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
						{navigation.map((item, index) => (
							<Link key={index} href={item.href}>
								<article className='bg-gradient-to-br from-main to-secondary flex items-center justify-center w-full aspect-[4/2] rounded-2xl p-4 mb-2'>
									{item.image}
								</article>
								<p className='text-xl text-center'>{item.title}</p>
							</Link>
						))}
					</div>
				</Container>
			)}
		</>
	)
}
