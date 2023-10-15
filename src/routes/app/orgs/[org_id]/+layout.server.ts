import { error, redirect } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma';

export const load = async ({ parent, params, depends, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'You are not logged in');
	}
	const organization = await prisma.organization.findFirstOrThrow({
		where: {
			id: params.org_id
		},
		include: {
			members: {
				where: {
					role: {
						equals: 'OWNER'
					},
					
				},
				include: {
					user: true,
					
					
				}
			},
			applications: true,
			owner: true,
			subscription: true,
			branding: true,
			
		}
	});
	if (organization.members.find(member => member.user.id === session.user.userId) === undefined) {
		throw error(403, "You're trying to access someone else's organization, That's a no-no! >:(");
	}

	depends('user:apps');

	return {
		organization,
		...(await parent())
	};
};
