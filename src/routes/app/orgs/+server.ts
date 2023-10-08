import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	const organization = await prisma.organization.findFirst({
		where: {
			id: id
		}
	});

	return json(organization);
};

export const POST = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	if (!session.user.userId) {
		throw error(400, 'Missing user id');
	}

	const payload =
		(await request.json()) as Prisma.OrganizationCreateWithoutOwnerInput;

	const organization = await prisma.organization.create({
		data: {
			...payload,
			owner: {
				connect: {
					id: session.user.userId
				}
			},
			members: {
				create: {
					user_id: session.user.userId,
					role: 'OWNER'
					
				}
			}
		}
	});

	return json(organization);
};

export const DELETE = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	await is_authorized(session, id, null);

	const organization = await prisma.organization.delete({
		where: {
			id: (id)
		}
	});
	return json({ id: organization.id });
};

export const PATCH = async ({ locals, request, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	await is_authorized(session, id, null);

	const payload = (await request.json()) as Prisma.OrganizationUpdateInput;

	const organization = await prisma.organization.update({
		where: {
			id: (id)
		},
		data: payload
	});
	return json({ id: organization.id });
};
