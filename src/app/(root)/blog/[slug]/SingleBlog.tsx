import { Container } from '@/components/ui/Container'
import { DateTag } from '@/components/ui/DateTag'
import { DateUtil } from '@/lib/dateLib'
import { IBlogPost } from '@/shared/types/blog.interface'

interface SingleBlogProps {
	post: IBlogPost
}

export function SingleBlog({ post }: SingleBlogProps) {
	return (
		<Container className='lg:min-h-[800px] sm:min-h-[500px]'>
			<h1 className='text-3xl mb-6'>{post.title}</h1>
			<div className='prose max-w-none mb-10' dangerouslySetInnerHTML={{ __html: post.content }} />
			{post.tags?.length ? <p className='text-muted-foreground mb-6'>{post.tags.join(' ')}</p> : null}
			{post.book && (
				<div className='border rounded-xl p-4 mb-8'>
					<p className='font-medium mb-2'>Источник</p>
					<p className='text-sm'>
						{post.book.title} — {post.book.author}
						{post.book.year ? `, ${post.book.year}` : ''}
					</p>
					{post.book.sourceUrl && (
						<p className='text-sm'>
							<a className='text-link' href={post.book.sourceUrl} target='_blank' rel='noreferrer'>
								Скачать книгу
							</a>
						</p>
					)}
				</div>
			)}
			<DateTag date={DateUtil(new Date(post.publishedAt || post.createdAt))} />
		</Container>
	)
}
