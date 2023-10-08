import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import { prisma } from 'src/lib/server/prisma';
import { createLegacySignInData, createSignInData } from 'src/lib/utils/sign_in_helpers';

export const GET = async ({ params, url }) => {
	// get rest of query params
	const { state } = Object.fromEntries(
		url.searchParams.entries()
	);
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
		where: {
			application_id_state: {
				application_id: params.app_id,
				state: state
			}
		},
		update: {
			created_at: timestamp,
			uuid,
			state,
			nonce: nonce,
			application_id: params.app_id,
			provider_account_id: params.public_key,
			uri: url.href.replace(url.search, ''),
		},
		create: {
			created_at: timestamp,
			uuid,
			state,
			nonce: nonce,
			application_id: params.app_id,
			provider_account_id: params.public_key,
			uri: url.href.replace(url.search, ''),
			provider: 'solana'
		}
	});

	const solanaSignInData = await createSignInData({
		// get url without any query params or public key
		address: params.public_key,
		uri: url.href.replace(url.search, ''),
		domain: url.host,
		nonce,
		issuedAt: timestamp.toISOString(),
	});

	const message = await createLegacySignInData({
		
		...solanaSignInData,
		address: params.public_key,});

	return json({
		siws: solanaSignInData,
		legacy: message
	});
};
