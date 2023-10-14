import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from 'src/lib/server/lucia.js';

export const load= async ({locals, url, cookies}) => {
    const session = await locals.auth.validate()
	const redirect_uri = url.searchParams.get("redirect_uri")
	const app_id = url.searchParams.get("app_id")
	if (redirect_uri) {
		cookies.set("original_redirect_uri", redirect_uri, {
			httpOnly: true,
			secure: !dev,
			path: "/",
			maxAge: 60 * 60
		});
	}
    return {
		app_id,
        session,
		redirect_uri
    }
    
};

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
    return fail(401);
  }
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to login page
	}
};