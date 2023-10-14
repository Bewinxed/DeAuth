import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized';
import { prisma } from 'src/lib/server/prisma';

export const GET = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, null);

	const limit = url.searchParams.get('limit');

	if (!limit || (limit && parseInt(limit) > 100)) {
		throw error(400, 'Limit cannot be greater than 100');
	}

	const skip = url.searchParams.get('skip') ?? undefined;
	const sortBy = (url.searchParams.get('sortBy') ?? undefined) as
		| Prisma.SessionOrderByWithRelationInput
		| undefined;

	const query = url.searchParams.get('query') ?? undefined;

	const members = await prisma.member.findMany({
		where: {
			application: {
                organization_id: params.org_id
            },
			user: query
				? {
						key: {
							some: {
								id: {
									contains: query
								}
							}
						}
				  }
				: undefined
		},
		include: {
			user: {
				select: {
					avatar_url: true,
					username: true,
					key: {
						select: {
							id	: true
						}
					}
				}
			},
			role_assignments: true
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
	return json(members);
};
