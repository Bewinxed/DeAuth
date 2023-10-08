import { error, json } from '@sveltejs/kit';
import type { AssetSortBy, AssetSortDirection } from 'helius-sdk';
import helius from 'src/lib/clients/helius';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const after = url.searchParams.get('after') ?? undefined;
	const before = url.searchParams.get('before') ?? undefined;
	const limit = url.searchParams.get('limit');
    const page = url.searchParams.get('page') ?? undefined
	const sortBy = (url.searchParams.get('sortBy') ?? undefined) as
		| {
				sortBy: AssetSortBy;
				sortDirection: AssetSortDirection;
		  }
		| undefined;

	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const nfts = await helius.rpc.getAssetsByOwner({
		ownerAddress: params.public_key,
		after,
		before,
        page: page ? parseInt(page) : 1,
		limit: limit ? parseInt(limit) : undefined,
		sortBy: sortBy ? sortBy : undefined
	});

	return json(nfts);
};
