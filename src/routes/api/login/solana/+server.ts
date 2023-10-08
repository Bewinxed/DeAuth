import { dev } from '$app/environment';
import { solana_oauth } from '$lib/server/lucia.js';



export const GET = async ({ cookies, url }) => {
	const [uri, state] = await solana_oauth.getAuthorizationUrl();
	// if redirect_uri is not null, add it to the query string
	// store state
	cookies.set('solana_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	// get all the query params
	const params = url.searchParams;
	// add the redirect_uri to the query params
	// redirect to the authorization url

	// return text url
	return new Response(`${uri}${params ? `&${params.toString()}` : ''}`, {
		headers: {
			'content-type': 'text/plain'
		}
	});
};
