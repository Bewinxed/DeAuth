import type { ValidatedSignatureData } from 'src/lib/auth/solAuth';

import { type RequestEvent, error } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma';

export async function GET({ url }: RequestEvent) {
	const session_id = url.searchParams.get('session');
	const signature = url.searchParams.get('proof');

	if (!session_id && !signature) {
		throw error(400, 'Missing session id');
	}

	const data = await prisma.authRequest
		.findFirstOrThrow({
			include: {
				session: true,
				user: true
			},
			where: {
				session: session_id
					? {
							some: {
								id: session_id
							}
					  }
					: undefined,
				signature: signature ?? undefined
			}
		})
		.catch(() => {
			throw error(404, 'Session not found');
		});

	const { session, user, ...auth_request } = data;

	if (!auth_request) {
		throw error(404, 'Auth request not found');
	}

	if (!user) {
		throw error(404, 'User not found');
	}

	if (session.length === 0) {
		throw error(404, 'Session not found');
	}

	if (
		!auth_request.access_token ||
		!auth_request.refresh_token ||
		!auth_request.access_token_expires_in ||
		!auth_request.signature
	) {
		throw error(401, 'No access token');
	}

	// Calculate expiry using session active_expires (bigint) and accessTokenExpiresIn (number)
	const expiry =
		session[0]?.active_expires +
		BigInt(session[0]?.access_token_expires_in) * BigInt(1000);

	if (expiry < Date.now()) {
		throw error(401, 'Session expired');
	}

	return new Response(
		JSON.stringify(
			{
				...session,
				access_token: auth_request.access_token,
				access_token_expires_in: auth_request.access_token_expires_in,
				account_id: auth_request.provider_account_id,
				application_id: auth_request.application_id,
				auth_request_id: auth_request.id,
				refresh_token: auth_request.refresh_token,
				signature: auth_request.signature,
				timestamp: auth_request.created_at.getTime(),
				user: user
			} as ValidatedSignatureData,
			(_, value) => (typeof value === 'bigint' ? value.toString() : value)
		)
	);
}
