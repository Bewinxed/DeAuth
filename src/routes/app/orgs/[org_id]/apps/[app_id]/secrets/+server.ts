import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';
import crypto from 'crypto';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const { app_id, org_id } = params;

	await is_authorized(session, org_id, app_id);

	const secrets = await prisma.application.findFirst({
		select: {
			refresh_token_secret: true,
			access_token_secret: true
		},
		where: {
			id: app_id
		}
	});

	return json(secrets);
};

export const PATCH = async ({ locals, request, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const payload: {
		refresh_token_secret?: boolean;
		access_token_secret?: boolean;
	} = await request.json();

	if (!session.user.userId) {
		throw error(400, 'Missing user id');
	}

	const { app_id, org_id } = params;

	await is_authorized(session, org_id, app_id);

	const { refresh_token_secret, access_token_secret } = {
		access_token_secret: payload.access_token_secret
			? crypto.randomBytes(32).toString('hex')
			: undefined,
		refresh_token_secret: payload.refresh_token_secret
			? crypto.randomBytes(32).toString('hex')
			: undefined
	};

	await prisma.application.update({
		where: {
			id: app_id
		},
		data: {
			access_token_secret,
			refresh_token_secret
		}
	});

	return json({
		access_token_secret: access_token_secret,
		refresh_token_secret: refresh_token_secret,
	});
};
