import type { OAuthProvider, Prisma } from '@prisma/client';
import type { JsonObject } from '@prisma/client/runtime/library';
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
	provider_account_id,
	provider,
	session,
	provider_user
}: {
	application: Prisma.ApplicationGetPayload<{
		include: {
			app_role: true;
		};
	}>;

	provider_account_id: string;
	provider: OAuthProvider;
	session: Session;
	provider_user: JsonObject;
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
				id: `${provider}:${provider_account_id}`
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
		return find_user_by_id(session.user.id);
	}

	return await add_key_to_user({
		provider_account_id,
		provider,
		session,
		provider_user
	}).then(() => find_user_by_id(existing_keys[0]?.user_id));
}

async function add_key_to_user({
	provider_account_id,
	provider,
	session,
	provider_user
}: {
	provider_account_id: string;
	provider: OAuthProvider;
	session: Session;
	provider_user: JsonObject;
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
						providerId: provider,
						password: null,
						providerUserId: provider_account_id
					})
					.then(
						async (key) =>
							({
								where: {
									id: `${key.providerId}:${key.providerUserId}`
								},
								data: {
									provider: provider,
									account_id: provider_account_id,
									additional_data: provider_user
								}
							}) as Prisma.KeyUpdateArgs
					)
			}
		}
	});
}

export async function handle_no_session({
	application,
	provider,
	provider_account_id,
	provider_user
}: {
	application: Prisma.ApplicationGetPayload<{
		include: {
			app_role: {
				where: {
					default_for_new_member: true;
				};
			};
		};
	}>;
	provider: OAuthProvider;
	provider_account_id: string;
	provider_user: JsonObject;
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
				id: `${provider}:${provider_account_id}`
			}
		});
	// try to upsert the user, along with roles and assignments
	const existingUserId = existing_keys[0]?.user_id;
	const default_roles = application.app_role.reduce(
		(acc: Prisma.app_role_assignmentCreateManyMemberInput[], role) => {
			if (role.default_for_new_member) {
				acc.push({
					app_role_id: role.id
				});
			}
			return acc;
		},
		[]
	);
	if (existingUserId) {
		console.debug(`Found existing user ${existingUserId}`);
		await prisma.user.update({
			where: {
				id: existingUserId
			},
			data: {
				memberships: {
					upsert: {
						where: {
							user_id_application_id: {
								user_id: existingUserId,
								application_id: application.id
							}
						},
						create: {
							application_id: application.id,
							role_assignments: {
								createMany: {
									// only add default roles
									skipDuplicates: true,
									data: default_roles
								}
							}
						},
						update: {
							role_assignments: {
								createMany: {
									skipDuplicates: true,
									data: default_roles
								}
							}
						}
					}
				},
				key: {
					update: {
						where: {
							id: `${provider}:${provider_account_id}`
						},
						data: {
							provider: provider,
							account_id: provider_account_id,
							additional_data: provider_user
						}
					}
				}
			},
			include: {
				memberships: {
					where: {
						application_id: application.id
					},
					include: {
						role_assignments: {
							where: {
								app_role_id: application.app_role[0].id
							}
						}
					}
				}
			}
		});

		return find_user_by_id(existingUserId);
	}

	return await create_new_user({
		provider,
		provider_account_id,
		provider_user,
		application_id: application.id
	}).then(
		async () =>
			await handle_no_session({
				application,

				provider_user,
				provider_account_id,
				provider
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

export async function create_new_user({
	provider,
	provider_account_id,
	provider_user,
	application_id
}: {
	provider: OAuthProvider;
	provider_account_id: string;
	provider_user: JsonObject;
	application_id: string;
}) {
	return await auth
		.createUser({
			userId: uuid(),
			key: {
				password: null,
				providerId: provider,
				providerUserId: provider_account_id
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
								id: `${provider}:${provider_account_id}`
							},
							data: {
								provider: provider,
								account_id: provider_account_id,
								additional_data: provider_user
							}
						}
					},
					memberships: {
						upsert: {
							where: {
								user_id_application_id: {
									user_id: user.id,
									application_id: application_id
								}
							},
							create: {
								application_id: application_id
							},
							update: {}
						}
					}
				}
			});
			return user;
		});
}

export function member_with_permissions(
	member: Prisma.MemberGetPayload<{
		include: {
			user: {
				select: {
					username: true;
					avatar_url: true;
				};
			};
			role_assignments: {
				select: {
					app_role: {
						include: {
							assigned_permissions: {
								include: {
									permission: {
										include: {
											resource: {
												select: {
													key: true;
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
			assigned_permissions: {
				include: {
					app_role: {
						select: {
							name: true;
						};
					};
					permission: {
						include: {
							resource: {
								select: {
									key: true;
								};
							};
						};
					};
				};
			};
		};
	}>
): OAuthMember {
	return {
		id: member.id,
		username: member.user.username,
		avatar_url: member.user.avatar_url,
		created_at: member.created_at,
		roles: member.role_assignments.map((role) => role.app_role.name),
		// join the key and the operation as key:operation and return as array of strings
		permissions: [
			...member.assigned_permissions.map(
				(permission) =>
					`${permission.permission.resource.key}:${permission.permission.operation}`
			),
			...member.role_assignments.map((role) =>
				role.app_role.assigned_permissions.map(
					(permission) =>
						`${permission.permission.resource.key}:${permission.permission.operation}`
				)
			).flat()
		]
	};
}

type OAuthMember = {
	id: string;
	username?: string | null;
	avatar_url?: string | null;
	created_at: Date;
	roles?: string[];
	permissions: string[];
};
