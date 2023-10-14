import { auth } from '$lib/server/lucia';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	// console.log(event.url.pathname)

	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api') && event.request.method === 'OPTIONS') {
       return new Response(null, {
 			headers: {
 			  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
 			  'Access-Control-Allow-Origin': '*',
 			  'Access-Control-Allow-Headers': '*',
 			}
 		  });
 }

	if (event.url.pathname.startsWith('/api/user')) {
		const session = await event.locals.auth.validate();
		if (!session) {
			throw error(401, 'You are not logged in');
		}
		// if api/users/xxx is not the same as the session user id
		// if (session.user.userId !== event.url.pathname.split('/')[3]) {
		// 	throw error(403, "You're trying to access someone else's user, That's a no-no! >:(");
		// }
	} else if (event.url.pathname.startsWith('/app')) {
		const session = await event.locals.auth.validate();
		if (!session) {
			throw redirect(302, `/login?redirect_uri=${event.url.pathname}`);
		}
	}

	const response = await resolve(event);
  if (event.url.pathname.startsWith('/api')) {
    response.headers.append('Access-Control-Allow-Origin', `*`);
  }

	return response;
};

