import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';
import type { ApiCreatePayload } from 'src/types/crud.js';

export const GET = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const resources = await prisma.appResources.findMany({
		where: {
			application_id: params.app_id
		}
	});

	return json(resources);
};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const payload =
		(await request.json()) as ApiCreatePayload<Prisma.AppResourcesCreateWithoutApplicationInput>;

	const resource = await prisma.appResources.create({
		data: { ...payload, application_id: params.app_id }
	}).catch((e) => {
		// catch duplicate key error
		if (e.code === 'P2002') {
			throw error(409, 'Duplicate resource name');
		}
		throw e;
	}
	);

	return json(resource);
};

export const DELETE = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	const resource = await prisma.appResources.delete({
		where: {
			id: parseInt(id)
		}
	});
	return json({ id: resource.id });
};

export const PATCH = async ({ locals, params, request, url }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}
	const payload = (await request.json()) as Prisma.AppResourcesGetPayload<{
		select: {
			id: true;
			name: true;
			description: true;
		};
	}>;

	const resource = await prisma.appResources.update({
		where: {
			id: parseInt(id)
		},
		data: {
			...payload,
			modified_by_user_id: session.user.userId
		}
	});
	return json(resource);
};

// export default new CrudController('resource', ['GET', 'PUT', 'DELETE', 'PATCH'])
