import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import {Database} from "./database.types";

export async function middleware(req: any) {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession()

    return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: [
        "/stage/*",
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}