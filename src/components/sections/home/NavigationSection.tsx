import { Container } from '@/components/ui/Container'
import { HomeCarousel } from '@/components/ui/home-carousel/HomeCarousel'
import { PUBLIC_URL } from '@/config/url.config'
import Image from 'next/image'
import Link from 'next/link'

export function NavigationSection() {
	return (
		<Container className='lg:flex gap-5 justify-between'>
			<HomeCarousel classname='lg:w-[65%] max-lg:mb-5' />
			<div className='space-y-[20px] lg:w-[35%]'>
				<Link
					href={PUBLIC_URL.applicant()}
					className='w-full xl:h-[113px] lg:h-[90px] h-[80px] rounded-[10px] bg-muted-foreground/10 500 px-5 py-4 flex justify-between items-center hover:opacity-85 transition-opacity'
				>
					<p className='xl:text-2xl lg:text-xl sm:text-sm text-[#222]'>Абитуриентам</p>
					<Image src='/svg/applicant3.svg' alt='Абитуриентам' width={82} height={82} className='xl:size-[82px] lg:size-[60px] size-[50px] ' />
				</Link>
				<Link
					href={PUBLIC_URL.students()}
					className='w-full xl:h-[113px] lg:h-[90px] h-[80px] rounded-[10px] bg-muted-foreground/10 500 px-5 py-4 flex justify-between items-center hover:opacity-85 transition-opacity'
				>
					<p className='xl:text-2xl lg:text-xl sm:text-sm text-[#222]'>Студентам</p>
					<Image src='/svg/students.svg' alt='Студентам' width={82} height={82} className='xl:size-[82px] lg:size-[60px] size-[50px] ' />
				</Link>
				<Link
					href={PUBLIC_URL.university()}
					className='w-full xl:h-[113px] lg:h-[90px] h-[80px] rounded-[10px] bg-muted-foreground/10 500 px-5 py-4 flex justify-between items-center hover:opacity-85 transition-opacity'
				>
					<p className='xl:text-2xl lg:text-xl sm:text-sm text-[#222]'>Университет</p>
					<Image src='/svg/university.svg' alt='Университет' width={82} height={67} className='xl:size-[82px] lg:size-[60px] size-[50px] ' />
				</Link>
			</div>
		</Container>
	)
}
