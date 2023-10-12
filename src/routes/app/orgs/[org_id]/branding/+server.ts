import type { Prisma } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import { is_authorized } from 'src/lib/security/is_authorized.js';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(400, 'Missing id');
	}

	const branding = await prisma.branding.findFirst({
		where: {
			id: parseInt(id)
		}
	});

	return json(branding);
};

export const PUT = async ({ locals, params, request, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const app_id: string | null | undefined = url.searchParams.get('app_id');
	const { org_id } = params;
	const payload = (await request.json()) as Prisma.BrandingUncheckedCreateInput;

	await is_authorized(session, org_id, app_id);

	const branding = await prisma.branding.upsert({
		where: {
			id: payload.id
		},
		create: {
			...payload,
			organization: org_id
				? {
						connect: {
							id: org_id
						}
				  }
				: undefined,
			application: app_id
				? {
						connect: {
							id: app_id
						}
				  }
				: undefined
		},
		update: {
			...payload,
		}
	});

	return json(branding);
};

export const DELETE = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');
	const app_id = url.searchParams.get('app_id');

	await is_authorized(session, params.org_id, app_id);

	if (!id) {
		throw error(400, 'Missing id');
	}

	const branding = await prisma.branding.delete({
		where: {
			id: parseInt(id)
		}
	});
	return json({ id: branding.id });
};

export const PATCH = async ({ locals, params, request, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const id = url.searchParams.get('id');
	const app_id = url.searchParams.get('app_id');

	await is_authorized(session, params.org_id, app_id);

	if (!id) {
		throw error(400, 'Missing id');
	}

	const payload = (await request.json()) as Prisma.BrandingGetPayload<{
		select: {};
	}>;

	const branding = await prisma.branding.update({
		where: {
			id: parseInt(id)
		},
		data: payload
	});
	return json({ id: branding.id });
};
