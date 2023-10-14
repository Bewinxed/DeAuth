import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const invites = await prisma.invites.findMany({
		where: {
			application_id: params.org_id
		}
	});

	return json(invites);
};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, null);

	const payload = (await request.json()) as Prisma.InvitesUncheckedCreateInput;

    await prisma.invites.deleteMany({
        where: {
            key_id: payload.key_id,
            application_id: params.org_id
        }
    })

	const invite = await prisma.invites
		.create({
			data: {
                from_user_id: session.user.userId,
				organization_id: params.org_id,
				key_id: payload.key_id
			},
            include: {
                key: {
                    include: {
                        user: {
                            select: {
                                avatar_url: true,
                                username: true
                            }
                        }
                    }
                }
            }
		})
		.catch((e) => {
			// if the key does not exist
			if (e.code === 'P2003') {
				throw error(400, 'User does not exist');
			}
            console.log(e)
			throw error(500, 'Internal Server Error');
		});
	return json(invite.key.user);
};

export const DELETE = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, url.searchParams.get('org_id'), null);

	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	const invite = await prisma.invites.delete({
		where: {
			id: parseInt(id)
		}
	});
	return json(invite);
};
