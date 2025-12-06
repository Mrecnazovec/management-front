export interface INewForm {
	title: string
	preview: string
	text: string
	slug: string
	isTopNew: boolean
	createdAt?: string | Date | null
}

export interface INew extends INewForm {
	id: string
	createdAt: Date
	updatedAt: Date
}
