import { DEFAULT_APP_ID, SEED } from '$env/static/private';
import { error } from '@sveltejs/kit';
import crypto from 'crypto';
import { prisma } from 'src/lib/server/prisma';

export const load = async ({ url }) => {
	// get the origin of the request
	// get the redirect_uri from the query string
	if (SEED === 'TRUE') {
		await prisma.user
			.upsert({
				create: {
					email: 'bewinxed@gmail.com',
					id: DEFAULT_APP_ID,
					name: 'DeAuth'
				},
				update: {
					email: 'bewinxed@gmail.com',
					name: 'DeAuth'
				},
				where: {
					id: DEFAULT_APP_ID
				}
			})
			.catch(() => {});
		await prisma.organization
			.upsert({
				create: {
					id: DEFAULT_APP_ID,
					name: 'DeAuth',
					owner_id: DEFAULT_APP_ID
				},
				update: {
					name: 'DeAuth',
					owner_id: DEFAULT_APP_ID
				},
				where: {
					id: DEFAULT_APP_ID
				}
			})
			.catch(() => {});
		await prisma.application
			.upsert({
				create: {
					access_token_secret: crypto.randomBytes(32).toString('hex'),
					app_role: {
						create: {
							app_role_assignment: {
								create: {
									id: 1,
									member_id: DEFAULT_APP_ID,
									
								}
							},
							id: 1
						}
					},
					authentication_rule: {
						createMany: {
							data: [
								{
									is_required: false,
									provider: 'discord'
								},
								{
									is_required: false,
									provider: 'solana'
								}
							]
						}
					},
					id: DEFAULT_APP_ID,
					member: {
						create: {
							id: DEFAULT_APP_ID,
							user_id: DEFAULT_APP_ID,
						}
					},
					name: 'DeAuth',
					organization_id: DEFAULT_APP_ID,
					refresh_token_secret: crypto.randomBytes(32).toString('hex')
					
				},
				update: {
					app_role: {
						create: {
							app_role_assignment: {
								
								create: {
									id: 1,
									member_id: DEFAULT_APP_ID,
									
								}
							},
							id: 1
						}
					},
					member: {
						create: {
							id: DEFAULT_APP_ID,
							user_id: DEFAULT_APP_ID,
						}
					},
					name: 'DeAuth'
				},
				where: {
					id: DEFAULT_APP_ID
				}
			})
			.catch((e) => {
				console.error(e);
			});
	}

	const app_id = url.searchParams.get('app_id');
	if (!app_id) {
		throw error(400, 'Missing app_id');
	}

	const application = await prisma.application
		.findFirstOrThrow({
			include: {
				app_role: true,
				branding: true,
				redirect_urls: true
			},
			where: {
				id: app_id
			}
		})
		.catch(() => {
			throw error(404, 'Application not found');
		});

	const organization = await prisma.organization.findFirstOrThrow({
		include: {
			branding: true
		},
		where: {
			id: application.organization_id,
		}
	});

	const redirect_uri = url.searchParams.get('redirect_uri');

	if (!redirect_uri) {
		throw error(400, 'Missing redirect_uri');
	}

	// const url_redirect = application.redirect_urls.find((url) =>
	// 	url.url.includes(redirect_uri)
	// );

	// TODO: Enable this
	// if (!url_redirect) {
	// 	throw error(400, 'Invalid redirect_uri');
	// }
	// get the rest of the query params
	const { scope, state, ...extras } = Object.fromEntries(
		url.searchParams.entries()
	);

	if (!redirect_uri) {
		throw error(400, 'Missing redirect_uri');
	}
	return {
		app_id,
		application,
		extras,
		organization,
		redirect_uri,
		scope,
		state
	};
};
