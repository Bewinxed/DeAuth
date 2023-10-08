import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';
import crypto from 'crypto';

export const GET = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');
	const org_id = url.searchParams.get('org_id');

	await is_authorized(session, org_id, id);

	if (!id) {
		throw error(400, 'Missing id');
	}

	const application = await prisma.application.findFirst({
		where: {
			id: id
		}
	});

	return json(application);
};

export const POST = async ({ locals, request, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const { org_id } = params;

	await is_authorized(session, org_id, null);

	const payload = (await request.json()) as Pick<
		Prisma.applicationCreateInput,
		'name'
	>;

	const application = await prisma.application.create({
		data: {
			...payload,
			access_token_secret: crypto.randomBytes(32).toString('hex'),
			refresh_token_secret: crypto.randomBytes(32).toString('hex'),
			organization_id: org_id,
			authentication_rule: {
				createMany: {
					data: [
						{
							provider: 'discord',
							is_required: false
						},
						{
							provider: 'solana',
							is_required: true
						}
					]
				}
			},
			app_role: {
				create: [
					{
						role: 'OWNER',
						
					},
				]
			},
		},
	include: {
		app_role: true
	}})

	await prisma.member.create({
		data: {
			application_id: application.id,
			user_id: session.user.userId,
			role_assignments: {
				create: {
					app_role_id: application.app_role[0].id,
					
				}
			}
		}
	})

	return json(application);
};

export const DELETE = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');
	const org_id = url.searchParams.get('org_id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	await is_authorized(session, org_id, id);

	const application = await prisma.application.delete({
		where: {
			id: id
		}
	});
	return json({ id: application.id });
};

export const PATCH = async ({ locals, request, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');
	const org_id = url.searchParams.get('org_id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	await is_authorized(session, org_id, id);

	const payload = (await request.json()) as Prisma.applicationUpdateInput;

	const application = await prisma.application.update({
		where: {
			id: id
		},
		data: payload
	});
	return json({ id: application.id });
};
