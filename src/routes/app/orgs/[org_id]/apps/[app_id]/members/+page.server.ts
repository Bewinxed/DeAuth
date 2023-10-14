import { prisma } from 'src/lib/server/prisma.js';

export const load = async ({ params, parent, depends, url }) => {
	const { app_id } = params;

	const users = await prisma.member.findMany({
		where: {
			application_id: app_id,
		},
		include: {
			user: {
				select: {
					avatar_url: true,
					username: true
				}
			},
			role_assignments: true
		},
		take: 10,
		skip: 0
	});

	depends('app:users');

	return {
		users,
		...(await parent()),
		promises: {
			page_2: prisma.member.findMany({
				where: {
					application_id: app_id
				},
				include: {
					user: {
						select: {
							avatar_url: true,
							username: true
						}
					},
					role_assignments: true
				},
				take: 10,
				skip: 10
			})
		}
	};
};
