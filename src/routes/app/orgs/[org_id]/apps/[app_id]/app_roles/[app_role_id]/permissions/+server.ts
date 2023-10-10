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

	const resource_permissions =
		await prisma.appPermissionAssignment.findFirstOrThrow({
			where: {
				app_role_id: parseInt(params.app_role_id)
			},
			include: {
				permission: true
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
		(await request.json()) as Prisma.AppPermissionGetPayload<object>[];

	console.log(
		payload.map((p) => ({
			permission_id: p.id,
			app_role_id: parseInt(params.app_role_id)
		}))
	);

	const app_role_permission = await prisma.appPermissionAssignment
		.createMany({
			skipDuplicates: true,
			data: payload.map((p) => ({
				permission_id: p.id,
				app_role_id: parseInt(params.app_role_id)
			}))
		})
		.then((r) => {
			if (r.count === 0) {
				throw error(409, 'No Changes');
			}

			return prisma.appPermissionAssignment.findMany({
				where: {
					app_role_id: parseInt(params.app_role_id),
					permission: {
						operation: {
							in: payload.map((p) => p.operation)
						}
					}
				},
				orderBy: {
					created_at: 'desc'
				}
			});
		});

	return json(app_role_permission);
};

export const DELETE = async ({ locals, request, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	await is_authorized(session, params.org_id, params.app_id);

	const payload = await request.json() as Array<number>;

	if (!payload || payload.length === 0) {
		throw error(400, 'Missing ids');
	}

	const resource_permission = await prisma.appPermissionAssignment.deleteMany({
		where: {
			id: {
				in: payload
			}
		}
	});
	return json(resource_permission);
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
	const payload =
		(await request.json()) as Partial<Prisma.AppResourcesCreateInput>;

	const resource_permission = await prisma.appPermissionAssignment.update({
		where: {
			id: parseInt(id)
		},
		data: payload
	});
	return json(resource_permission);
};

// export default new CrudController('resource', ['GET', 'PUT', 'DELETE', 'PATCH'])
