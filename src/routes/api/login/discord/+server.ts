// routes/login/github/+server.ts
import { dev } from "$app/environment";
import { DEFAULT_APP_ID } from "$env/static/private";
import { discord_oauth } from "$lib/server/lucia.js";
import { error } from "@sveltejs/kit";
import crypto from 'crypto';
import { prisma } from "src/lib/server/prisma.js";
import { v4 as uuid } from 'uuid';

export const GET = async (request) => {
	const app_id = request.url.searchParams.get("app_id") ?? DEFAULT_APP_ID;
	if (!app_id) {
		throw error(400, "Missing app_id");
	}
	const [url, state] = await discord_oauth.getAuthorizationUrl();
	const params = url.searchParams;
	// store state
	await prisma.authRequest.create({
		data: {
			uuid: uuid(),
			state,
			nonce: crypto.randomBytes(32).toString('hex'),
			application_id: app_id,
			uri: url.href.replace(url.search, ''),
			provider_account_id: '',
			provider: 'discord'
		}
	});
	request.cookies.set("discord_oauth_state", state, {
		httpOnly: true,
		secure: !dev,
		path: "/",
		maxAge: 60 * 60,
	});

	return new Response(`${url}${params ? `&${params.toString()}` : ''}`, {
		headers: {
			'content-type': 'text/plain'
		}
	});
};