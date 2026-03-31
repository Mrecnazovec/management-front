import { Container } from '@/components/ui/Container'
import { DateTag } from '@/components/ui/DateTag'
import { PATH_URL } from '@/config/url.config'
import AOSComponent from '@/lib/aos'
import { DateUtil } from '@/lib/dateLib'
import { INew } from '@/shared/types/new.interface'
import Image from 'next/image'
import Link from 'next/link'

interface SingleNewsProps {
	post: INew
}

export function SingleNews({ post }: SingleNewsProps) {
	return (
		<AOSComponent>
			<Container className='lg:min-h-[800px] sm:min-h-[500px]'>
				<div data-aos='fade-up'>
					<h1 className='text-3xl mb-10'>
						{post.title}
					</h1>

					<div className='mb-14 clearfix'>
						<div className='relative aspect-[16/9] lg:w-[50%] w-full rounded-2xl overflow-hidden shadow-md sm:float-left mr-16 mb-4'>
							<Image src={post.preview} alt={post.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 50vw' priority />
							{post.isTopNew && <div className='absolute top-0 right-0 bg-danger text-white p-2 rounded-sm text-sm'>В топе</div>}
						</div>
						<div className='space-y-4'>
							<div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: post.text }} />
						</div>
					</div>

					<div>
						<DateTag date={DateUtil(post.createdAt)} />
					</div>

					<div>
						<p className='mb-4'>Подписывайтесь на наши соцсети:</p>
						<div className='flex items-center gap-4 flex-wrap'>
							<Link className='px-2 py-1 bg-[#27a7e7] flex text-white items-center gap-4 w-fit  rounded-[5px]' href={'https://t.me/Managment_TF_MSU'}>
								<Image src={PATH_URL.svg('tg.svg')} width={30} height={30} alt='Telegram' /> Telegram
							</Link>
							<Link
								className='px-2 py-1 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex text-white items-center gap-4 w-fit rounded-[5px]'
								href={'https://www.instagram.com/msu_uz_management/?utm_source=ig_web_button_share_sheet'}
							>
								<Image src={PATH_URL.svg('inst.svg')} width={30} height={30} alt='Instagram' /> Instagram
							</Link>
						</div>
					</div>
				</div>
			</Container>
		</AOSComponent>
	)
}
