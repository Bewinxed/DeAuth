import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, url, params, setHeaders }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const by = url.searchParams.get('by') as 'userId' | 'account_id';

	const user = await prisma.user.findFirst({
		where: {
			id: by === 'userId' ? params.user_id : undefined,
			key:
				by === 'account_id'
					? {
							some: {
								account_id: params.user_id
							}
					  }
					: undefined
		},
		include: {
			key: true,
		}
	});

	setHeaders({
		"cache-control": "max-age=60",
	});
	

	return json(user);
};

export const PATCH = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const payload = (await request.json()) as Partial<Prisma.UserGetPayload<object>>;

	const user = await prisma.user.update({
		where: {
			id: session.user.userId
		},
		data: payload
	});

	return json(user);
};
