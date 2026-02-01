import { PUBLIC_URL } from '@/config/url.config'
import { DateUtil } from '@/lib/dateLib'
import { stripHtml } from '@/lib/generateDescription'
import { IBlogPost } from '@/shared/types/blog.interface'
import Link from 'next/link'

interface BlogCardProps {
	post: IBlogPost
}

export function BlogCard({ post }: BlogCardProps) {
	return (
		<Link href={PUBLIC_URL.blog(post.slug)} className='block border rounded-2xl p-4 hover:shadow-md transition-shadow'>
			<p className='text-lg mb-2'>{post.title}</p>
			<p className='text-muted-foreground mb-4 line-clamp-3'>{post.excerpt || stripHtml(post.content)}</p>
			<span className='text-sm text-muted-foreground'>{DateUtil(new Date(post.publishedAt || post.createdAt))}</span>
		</Link>
	)
}
