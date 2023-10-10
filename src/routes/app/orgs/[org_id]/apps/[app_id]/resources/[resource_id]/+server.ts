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

	const resource_permissions = await prisma.appPermission.findMany({
		where: {
			application_id: params.app_id,
			resource_id: parseInt(params.resource_id)
		}
	});

	return json(resource_permissions);
};

export const PUT = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const payload =
		(await request.json()) as ApiCreatePayload<Prisma.AppPermissionCreateWithoutResourceInput>;

	const resource_permission = await prisma.appPermission.create({
		data: {
			...payload,
			resource: {
				connect: {
					id: parseInt(params.resource_id)
				}
			},
			application: {
				connect: {
					id: params.app_id
				}
			}
		}
	});
	return json(resource_permission);
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

	const resource_permission = await prisma.appPermission.delete({
		where: {
			id: parseInt(id),
            resource_id: parseInt(params.resource_id),
            application_id: params.app_id
		}
	});
	return json({ id: resource_permission.id });
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
	const payload = (await request.json()) as Partial<Prisma.AppPermissionUncheckedCreateInput>;

	const resource_permission = await prisma.appPermission.update({
		where: {
			id: parseInt(id),
            resource_id: parseInt(params.resource_id),
            application_id: params.app_id
		},
		data: {
			...payload,
			modified_by_user_id: session.user.userId
		}
	});
	return json(resource_permission);
};

// export default new CrudController('resource', ['GET', 'PUT', 'DELETE', 'PATCH'])
