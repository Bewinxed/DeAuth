import type { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized';
import { prisma } from 'src/lib/server/prisma';
import type { RequestHandler } from './$types';

// @ts-expect-error ignore type, serializing bigint
export const GET: RequestHandler = async ({ locals, params, url }) => {

	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const limit = url.searchParams.get('limit');

	if (!limit || (limit && parseInt(limit) > 100)) {
		throw error(400, 'Limit cannot be greater than 100');
	}

	const skip = url.searchParams.get('skip') ?? undefined;
	const sortBy = (url.searchParams.get('sortBy') ?? undefined) as
		| Prisma.SessionOrderByWithRelationInput
		| undefined;

	const sessions = await prisma.session.findMany({
		where: {
			application_id: params.app_id,
			access_token: {
				not: undefined
			}
		},
		take: limit ? parseInt(limit) : undefined,
		skip: skip ? parseInt(skip) : undefined,
		orderBy: sortBy
			? sortBy
			: {
					created_at: 'desc'
			  }
	});

	// const max_page = await prisma.session.count({
	//     where: {
	//         application_id: params.app_id,
	//         access_token: {
	//             not: undefined
	//         },
	//     }
	// })

	// convert big int to string
    // @ts-expect-error ignore type, serializing bigint
	return new Response(
		JSON.stringify(sessions, (_, value) =>
			typeof value === 'bigint' ? value.toString() : value
		)
	) as Prisma.SessionGetPayload<object>;
};
