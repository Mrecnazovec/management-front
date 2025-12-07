import { NextResponse, type NextRequest } from 'next/server'
import { EnumTokens } from './services/auth/auth-token.service'
import { ADMIN_URL } from './config/url.config'

export async function middleware(request: NextRequest) {
	const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value

	const isAuthPage = request.url.includes(ADMIN_URL.auth())

	if (isAuthPage) {
		if (refreshToken) {
			return NextResponse.redirect(new URL(ADMIN_URL.home(), request.url))
		}

		return NextResponse.next()
	}

	if (refreshToken === undefined) {
		console.log(`refreshToken: ${refreshToken}`)

		return NextResponse.redirect(new URL(ADMIN_URL.auth(), request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/msu-ek123/:path*', '/control-msu-ek123'],
}
