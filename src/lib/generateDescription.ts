export function stripHtml(html?: string | null): string {
	if (!html) return ''

	const plain = html
		.replace(/<[^>]*>?/gm, '')
		.replace(/\s+/g, ' ')
		.trim()

	if (plain.length <= 250) return plain

	return plain.slice(0, 250).trim() + '...'
}
