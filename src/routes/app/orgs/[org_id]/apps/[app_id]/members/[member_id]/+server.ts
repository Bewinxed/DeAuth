
import { error, json } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';

export const GET = async ({ locals, url, params, setHeaders }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const member = await prisma.member.findFirstOrThrow({
		where: {
			id: params.member_id,
			application_id: params.app_id
		},
		include: {
			user: {
				select: {
					avatar_url: true,
				},
				include: {
					
					key: true
				}
			},
            role_assignments: true
			
		}
	}).catch(() => {
        throw error(404, 'Member not found');
    });

	setHeaders({
		"cache-control": "max-age=60",
	});
	

	return json(member);
};