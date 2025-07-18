import { fail, redirect } from '@sveltejs/kit';
import { auth } from 'src/lib/server/lucia.js';

export const load= async ({locals}) => {
    const session = await locals.auth.validate()
    return {
        session
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