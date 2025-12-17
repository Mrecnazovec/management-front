import type { PropsWithChildren } from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { Suspense } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	// Disable caching for all /msu-ek123 routes; they must load fresh on each visit
	noStore()
	return <Suspense fallback={null}>{children}</Suspense>
}
