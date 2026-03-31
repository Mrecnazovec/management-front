'use client'

import { Container } from '@/components/ui/Container'
import { PATH_URL, PUBLIC_URL } from '@/config/url.config'
import Image from 'next/image'
import Link from 'next/link'
import { AboutList } from './AboutList'
import { ArrowUpFromDot } from 'lucide-react'
import dynamic from 'next/dynamic'
import AOSComponent from '@/lib/aos'

const FormModal = dynamic(() => import('@/components/ui/modals/FormModal'))

export function University() {
	return (
		<AOSComponent>
			<Container className='overflow-x-hidden'>
				<div data-aos='fade-up'>
					<h1 className='sr-only'>Университет ТФ МГУ</h1>
					<div className='flex items-center lg:gap-14 gap-7 mb-8 max-lg:flex-col'>
						<Image src={PATH_URL.jpg('university.jpg')} alt='Университет ТФ МГУ' width={500} height={333} className='rounded-2xl' />
						<p className='lg:max-w-[560px] text-base'>
							Ташкентский филиал МГУ создан в 2006 году, это учебное заведение сегодня является ведущим центром подготовки специалистов в области
							менеджмента, психологии, математики, информатики, психологии и филологии для нужд Узбекистана.
							<br /> <br /> Филиал создан на основании Постановления Президента Республики Узбекистан от 24.02.2006г. № ПП-290 «Об организации
							деятельности филиала Московского государственного университета имени М.В.Ломоносова в г.Ташкенте».
						</p>
					</div>
					<p className='text-base mb-14'>
						Основной задачей Филиала является подготовка высококвалифицированных специалистов в соответствии с нормами, принятыми в МГУ им. М.В.
						Ломоносова, и общепризнанными международными требованиями, предъявляемыми к качеству высшего образования, целями и задачами Национальной
						программы по подготовке кадров Республики Узбекистан. <br /> <br />
						Деятельность Филиала осуществляется в соответствии с законодательством Республики Узбекистан и Российской Федерации. <br />
						<br />
						Прием абитуриентов и аттестация выпускников Филиала осуществляются в соответствии с требованиями, порядком и сроками, устанавливаемыми МГУ
						им. М.В. Ломоносова. <br />
						<br />
						Обучение в Филиале осуществляется по{' '}
						<Link className='text-link' href={PUBLIC_URL.students('plan')}>
							учебным планам
						</Link>{' '}
						и программам, утвержденным МГУ им. М.В. Ломоносова. <br />
						<br />
						Выдаваемый выпускникам Филиала диплом установленного образца об окончании МГУ им. М.В.  Ломоносова признается документом о высшем
						образовании в Республике Узбекистан.
					</p>
					<h2 className='text-3xl mb-4'>
						О направлении:
					</h2>
					<p className='text-paragraph mb-2'>
						Направление Менеджмент было открыто в 2023/2024 учебном году.
					</p>
					<p className='text-paragraph mb-8'>
						Учебный план можно охарактеризовать пятью важными особенностями:
					</p>
					<AboutList />
					<AOSComponent>
						<section>
							<h2 className='text-3xl mb-4'>Дополнительные разделы с информацией:</h2>
							<p className='text-paragraph mb-8'>В разделах предоставлена актуальная информация про наш университет</p>

							<div className='grid grid-cols-3 gap-4'>
								<Link
									href={PUBLIC_URL.university('administration')}
									className='sm:aspect-[1200/400] aspect-[810/400] sm:col-span-3 col-span-3 bg-[url("/png/administration.png")] bg-no-repeat bg-cover object-cover relative rounded-2xl'
								>
									<div className='flex items-center gap-2 text-white text-xl absolute md:bottom-[30px] bottom-[5px] md:left-[30px] left-[5px] font-semibold font-msu'>
										<p>Руководство</p>
										<ArrowUpFromDot className='rotate-90' />
									</div>
								</Link>
								<Link
									href={PUBLIC_URL.university('teachers')}
									className='aspect-[810/400] sm:col-span-2 col-span-3 bg-[url("/jpg/teachers.jpg")] bg-no-repeat bg-cover object-cover relative rounded-2xl bg-[position:top_20%_center]'
								>
									<div className='flex items-center gap-2 text-white text-xl absolute md:bottom-[30px] bottom-[5px] md:left-[30px] left-[5px] font-semibold font-msu'>
										<p>Преподаватели</p>
										<ArrowUpFromDot className='rotate-90' />
									</div>
								</Link>
								<Link
									href={PUBLIC_URL.university('union')}
									className='sm:aspect-[400/400] aspect-[810/400] sm:col-span-1 col-span-3 bg-[url("/jpg/union.jpg")] bg-no-repeat bg-cover object-cover relative rounded-2xl bg-[position:top_40%_center]'
								>
									<div className='flex items-center gap-2 text-white text-xl absolute md:bottom-[30px] bottom-[5px] md:left-[30px] left-[5px] font-semibold font-msu'>
										{/* <p>Студ. совет</p> */}
										{/* <ArrowUpFromDot className='rotate-90' /> */}
									</div>
								</Link>
							</div>
						</section>
					</AOSComponent>
					{/* <FormModal /> */}
				</div>
			</Container>
		</AOSComponent>
	)
}
