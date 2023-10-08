import type { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({ cookies, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	let auth_request: Prisma.AuthRequestGetPayload<object> | null = null;

	const storedState = cookies.get('solana_oauth_state');

	if (!storedState) {
		auth_request = await prisma.authRequest.findFirst({
			where: {
				state: storedState
			}
		});
	}

	const user = await prisma.user
		.findFirstOrThrow({
			where: {
				id: session.user.userId
			},
			include: {
				nfts: true,
				key: true,
				memberships: true
			}
		})
		.catch(() => {
			throw redirect(302, '/login');
		});

	return {
		session,
		user,
		auth_request
	};
};
