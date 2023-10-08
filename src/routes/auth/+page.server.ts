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
				where: {
					id: DEFAULT_APP_ID
				},
				create: {
					id: DEFAULT_APP_ID,
					name: 'DeAuth',
					email: 'bewinxed@gmail.com'
				},
				update: {
					name: 'DeAuth',
					email: 'bewinxed@gmail.com'
				}
			})
			.catch(() => {});
		await prisma.organization
			.upsert({
				where: {
					id: DEFAULT_APP_ID
				},
				create: {
					id: DEFAULT_APP_ID,
					name: 'DeAuth',
					owner_id: DEFAULT_APP_ID
				},
				update: {
					name: 'DeAuth',
					owner_id: DEFAULT_APP_ID
				}
			})
			.catch(() => {});
		await prisma.application
			.upsert({
				where: {
					id: DEFAULT_APP_ID
				},
				create: {
					id: DEFAULT_APP_ID,
					name: 'DeAuth',
					organization_id: DEFAULT_APP_ID,
					access_token_secret: crypto.randomBytes(32).toString('hex'),
					refresh_token_secret: crypto.randomBytes(32).toString('hex'),
					authentication_rule: {
						createMany: {
							data: [
								{
									provider: 'discord',
									is_required: false
								},
								{
									provider: 'solana',
									is_required: false
								}
							]
						}
					},
					member: {
						create: {
							id: 1,
							user_id: DEFAULT_APP_ID,
						}
					},
					app_role: {
						create: {
							id: 1,
							app_role_assignment: {
								create: {
									id: 1,
									member_id: 1,
									
								}
							}
						}
					}
					
				},
				update: {
					name: 'DeAuth',
					member: {
						create: {
							id: 1,
							user_id: DEFAULT_APP_ID,
						}
					},
					app_role: {
						create: {
							id: 1,
							app_role_assignment: {
								
								create: {
									id: 1,
									member_id: 1,
									
								}
							}
						}
					}
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
			where: {
				id: app_id
			},
			include: {
				app_role: true,
				branding: true,
				redirect_urls: true
			}
		})
		.catch(() => {
			throw error(404, 'Application not found');
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
		application,
		redirect_uri,
		scope,
		state,
		app_id,
		extras
	};
};
