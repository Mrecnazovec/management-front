import { PUBLIC_URL } from '@/config/url.config'
import AOSComponent from '@/lib/aos'
import { DateUtil } from '@/lib/dateLib'
import { INew } from '@/shared/types/new.interface'
import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
	post: INew
}

export function NewsCard({ post }: NewsCardProps) {
	return (
		<AOSComponent>
			<Link href={PUBLIC_URL.news(post.slug)} data-aos='fade-up'>
				<article className='relative aspect-[16/9] rounded-2xl mb-2'>
					{post.isTopNew && <div className='absolute top-0 right-0 bg-danger text-white p-2 rounded-sm text-sm z-10'>В топе</div>}
					<Image src={post.preview} alt='Новый сайт' className='object-cover mb-2 rounded-2xl' fill />
				</article>
				<p className='mb-4'>{post.title}</p>
				<span className='text-muted-foreground'>{DateUtil(post.createdAt)}</span>
			</Link>
		</AOSComponent>
	)
}
