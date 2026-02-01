export type BookLanguage = 'ru' | 'en'
export type BlogRubric = 'ideas_from_books'
export type BlogPostStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'failed'

export interface IBook {
	id: string
	title: string
	author: string
	year?: number | null
	language: BookLanguage
	publicDomain: boolean
	sourceUrl: string
	description?: string | null
	createdAt: string
	updatedAt: string
	postsCount?: number
	publishedCount?: number
}

export interface IBlogPost {
	id: string
	bookId: string
	rubric: BlogRubric
	tags: string[]
	title: string
	slug: string
	content: string
	excerpt?: string | null
	order?: number | null
	status: BlogPostStatus
	scheduledAt?: string | null
	publishedAt?: string | null
	telegramMessageId?: string | null
	telegramPostedAt?: string | null
	telegramFailed?: boolean
	createdAt: string
	updatedAt: string
	book?: IBook
}
