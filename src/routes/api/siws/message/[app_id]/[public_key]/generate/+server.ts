import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import { prisma } from 'src/lib/server/prisma';
import {
	createLegacySignInData,
	createSignInData
} from 'src/lib/utils/sign_in_helpers';

export const GET = async ({ params, url }) => {
	// get rest of query params
	const state = url.searchParams.get('state');
	if (!state) {
		throw new Error('Invalid state');
	}

	if (!params.public_key) {
		throw new Error('Invalid TOTP');
	}

	const uuid = crypto.randomUUID();

	// await prisma.authRequest.deleteMany({
	// 	where: {
	// 		provider_account_id: params.public_key,
	// 		access_token: null
	// 	}
	// });

	const nonce = crypto.randomBytes(32).toString('hex');

	const timestamp = new Date();

	await prisma.authRequest.upsert({
		create: {
			application_id: params.app_id,
			created_at: timestamp,
			nonce: nonce,
			provider: 'solana',
			provider_account_id: params.public_key,
			state,
			uri: url.href.replace(url.search, ''),
			uuid
		},
		update: {
			application_id: params.app_id,
			created_at: timestamp,
			nonce: nonce,
			provider_account_id: params.public_key,
			state,
			uri: url.href.replace(url.search, ''),
			uuid
		},
		where: {
			application_id_state: {
				application_id: params.app_id,
				state: state
			}
		}
	});

	const solanaSignInData = await createSignInData({
		// get url without any query params or public key
		address: params.public_key,
		domain: url.host,
		issuedAt: timestamp.toISOString(),
		nonce,
		uri: url.href.replace(url.search, '')
	});

	const message = await createLegacySignInData({
		...solanaSignInData,
		address: params.public_key
	});

	return json({
		legacy: message,
		siws: solanaSignInData
	});
};
