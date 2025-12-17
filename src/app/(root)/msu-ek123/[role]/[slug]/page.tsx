import type { Metadata } from 'next'
import { Suspense } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { UpdateSubject } from './UpdateSubject'

export const metadata: Metadata = {
	title: 'Обновление сотрудника',
	...NO_INDEX_PAGE,
}

export default async function Page() {
	noStore()

	return (
		<Suspense fallback={null}>
			<UpdateSubject />
		</Suspense>
	)
}
