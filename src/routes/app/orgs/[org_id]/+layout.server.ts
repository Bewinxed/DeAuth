import { prisma } from 'src/lib/server/prisma';

export const load = async ({ parent, params, depends }) => {
	const organization = await prisma.organization.findFirstOrThrow({
		where: {
			id: params.org_id
		},
		include: {
			members: true,
			applications: true,
			owner: true,
			subscription: true,
		}
	});

	depends('user:apps');

	return {
		organization,
		...(await parent())
	};
};
