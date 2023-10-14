import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';
import { member_with_permissions } from 'src/routes/api/auth/callback/[provider]/auth_utils.js';

export const GET = async ({ params, url, request }) => {
	const { session_id } = params;
	const access_token = url.searchParams.get('access_token') as
		| string
		| undefined;

	const session = await prisma.session
		.findFirstOrThrow({
			where: {
				id: session_id
			}
		})
		.catch(() => {
			throw error(404, 'Session not found');
		});
	// if origin isn't 127.0.0.1 or deauth.xyz, then check the access token
    // console.log all header

	if (
		!['deauth.xyz',  (dev ? '127.0.0.1' : '')].includes(new URL(url.origin).hostname) &&


		session.access_token !== access_token
	) {
		throw error(401, 'Unauthorized');
	}

	const member = await prisma.member
		.findFirstOrThrow({
			where: {
				application_id: session.application_id,
				user_id: session.user_id
			},
			include: {
				user: {
					select: {
						username: true,
						avatar_url: true
					}
				},
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
                                                        key: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
				assigned_permissions: {
					include: {
						app_role: {
							select: {
								name: true
							}
						},
						permission: {
							include: {
								resource: {
									select: {
										key: true
									}
								}
							}
						}
					}
				}
			}
		})
		.catch(() => {
			throw error(404, 'Member not found');
		});

	return json(member_with_permissions(member));
};
