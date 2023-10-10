import { prisma } from 'src/lib/server/prisma';

export const load = async ({ parent, params, depends }) => {
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

	depends('user:apps');

	return {
		organization,
		...(await parent())
	};
};
