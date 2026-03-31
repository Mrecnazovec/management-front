import { Container } from '@/components/ui/Container'
import { BlogCard } from '@/components/cards/BlogCard'
import { useGetPublicPosts } from '@/hooks/queries/blog/useGetPublicPosts'
import { PUBLIC_URL } from '@/config/url.config'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function BlogSection() {
	const { posts, isLoading } = useGetPublicPosts(6)

	return (
		<Container className='mb-20'>
			<div className='flex items-center justify-between gap-4 mb-[30px]'>
				<h2 className='text-3xl'>Последние посты блога</h2>
				<Link href={PUBLIC_URL.blog('')}>
					<Button variant='outline'>Все посты</Button>
				</Link>
			</div>
			<div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-5'>
				{isLoading
					? Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className='animate-pulse border rounded-2xl p-4'>
								<div className='h-4 bg-gray-300 rounded mb-2 w-3/4' />
								<div className='h-3 bg-gray-300 rounded mb-2 w-full' />
								<div className='h-3 bg-gray-300 rounded mb-2 w-5/6' />
								<div className='h-3 bg-gray-300 rounded w-1/3' />
							</div>
					  ))
					: posts?.map((post) => <BlogCard key={post.id} post={post} />)}
			</div>
		</Container>
	)
}
