import type { Prisma } from '@prisma/client';
import type { Session } from 'lucia';
import { auth } from 'src/lib/server/lucia';
import { prisma } from 'src/lib/server/prisma';
import { v4 as uuid } from 'uuid';

export async function connect_existing_user(
	existing_user: Prisma.UserGetPayload<object>,
	session: Session
) {
	const transaction = [
		prisma.key.updateMany({
			where: { user_id: session.user.id },
			data: { user_id: existing_user.id }
		}),
		prisma.member.updateMany({
			where: { user_id: session.user.id },
			data: { user_id: existing_user.id }
		}),
		prisma.user_role.updateMany({
			where: { user_id: session.user.id },
			data: { user_id: existing_user.id }
		}),
		prisma.authRequest.updateMany({
			where: { user_id: session.user.id },
			data: { user_id: existing_user.id }
		}),
		prisma.nft.updateMany({
			where: { user_id: session.user.id },
			data: { user_id: existing_user.id }
		}),
		prisma.session.deleteMany({
			where: { user_id: session.user.id }
		})
	];
	await prisma.$transaction(transaction).then(async () => {
		// find all keys for this user, then get them all, replace the id with the new user id, then update them all
		await prisma.user.delete({
			where: { id: session.user.id }
		});
	});
}

export async function handle_existing_session({
	application,
	auth_request,
	session
}: {
	application: Prisma.ApplicationGetPayload<{
		include: {
			app_role: true;
		};
	}>;
	auth_request: Prisma.AuthRequestGetPayload<object>;
	session: Session;
}): Promise<
	Prisma.UserGetPayload<{
		include: {
			key: true;
		};
	}>
> {
	const existing_keys: Prisma.KeyGetPayload<object>[] =
		await prisma.key.findMany({
			where: {
				id: `${auth_request.provider}:${auth_request.provider_account_id}`
			}
		});
	if (existing_keys.length > 0) {
		if (existing_keys[0].user_id !== session.user.userId) {
			const existing_user = await find_user_by_id(existing_keys[0]?.user_id);
			if (existing_user.id !== session.user.id) {
				// await connect_existing_user(existing_user, session).then(() =>
				// 	find_user_by_id(existing_user.id)
				// );
			}
		}
		return find_user_by_id(session.user.id)
	}

	return await add_key_to_user({
		authRequest: auth_request,
		session
	}).then(
		async () =>
			await prisma.member
				.create({
					data: {
						application_id: application.id,
						user_id: session.user.id,
						role_assignments: {
							create: {
								app_role_id: application.app_role[0].id
							}
						}
					}
				})
				.then(() => find_user_by_id(existing_keys[0]?.user_id))
	);
}

async function add_key_to_user({
	authRequest,
	session
}: {
	authRequest: Prisma.AuthRequestGetPayload<object>;
	session: Session;
}) {
	await prisma.user.update({
		where: {
			id: session.user.userId
		},

		data: {
			key: {
				update: await auth
					.createKey({
						userId: session.user.userId,
						providerId: authRequest.provider,
						password: null,
						providerUserId: authRequest.provider_account_id
					})
					.then(async (key) => ({
						where: {
							id: `${key.providerId}:${key.providerUserId}`
						},
						data: {
							provider: authRequest.provider,
							additional_data: {
								public_key: authRequest?.provider_account_id,
								balance: 0
							},
							account_id: authRequest?.provider_account_id
						}
					}))
			}
		}
	});
}

export async function handle_no_session({
	application,
	auth_request: auth_request
}: {
	application: Prisma.ApplicationGetPayload<{
		include: {
			app_role: true;
		};
	}>;
	auth_request: Prisma.AuthRequestGetPayload<object>;
}): Promise<
	Prisma.UserGetPayload<{
		include: {
			key: true;
		};
	}>
> {
	const existing_keys: Prisma.KeyGetPayload<object>[] =
		await prisma.key.findMany({
			where: {
				id: `${auth_request.provider}:${auth_request.provider_account_id}`
			}
		});
	// try to upsert the user, along with roles and assignments
	const existingUserId = existing_keys[0]?.user_id;
	if (existingUserId) {
		console.log(`Found existing user ${existingUserId}`);
		
		await prisma.member
			.create({
				data: {
					application_id: application.id,
					user_id: existingUserId,
					role_assignments: {
						create: {
							app_role_id: application.app_role[0].id
						}
					}
				}
			})
			.catch(() =>
				console.debug(
					`User ${existingUserId} already has role ${application.app_role[0].id}`
				)
			);
		return find_user_by_id(existingUserId);
	}

	return await create_new_user(auth_request).then(
		async () =>
			await handle_no_session({
				application,
				auth_request: auth_request
			})
	);
}

export async function find_user_by_id(
	user_id: string
): Promise<Prisma.UserGetPayload<{ include: { key: true } }>> {
	return prisma.user.findFirstOrThrow({
		where: { id: user_id },
		include: { key: true }
	});
}

export async function create_new_user(
	auth_request: Prisma.AuthRequestGetPayload<object>
) {
	return await auth
		.createUser({
			userId: uuid(),
			key: {
				password: null,
				providerId: auth_request.provider,
				providerUserId: auth_request.provider_account_id
			},
			attributes: {
				// get random image from https://doodleipsum.com/500/avatar-2
				avatar_url: await fetch(
					'https://doodleipsum.com/500/avatar-2?bg=00000000&fg=ffffff00&size=512'
				)
					.then((res) => res.url)
					.catch(() => null)
			}
		})
		.then(async (user) => {
			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					key: {
						update: {
							where: {
								id: `${auth_request.provider}:${auth_request.provider_account_id}`
							},
							data: {
								provider: auth_request.provider,
								account_id: auth_request?.provider_account_id
							}
						}
					},
					memberships: {
						upsert: {
							where: {
								user_id_application_id: {
									user_id: user.id,
									application_id: auth_request.application_id
								}
							},
							create: {
								application_id: auth_request.application_id
							},
							update: {}
						}
					}
				}
			});
			return user;
		});
}
