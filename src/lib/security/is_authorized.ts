import { error } from "@sveltejs/kit";
import type { Session } from "lucia";
import { prisma } from "../server/prisma";

export async function is_authorized(session: Session, org_id: string | null, app_id: string | null) {
	if (app_id) {
		const isOwner = await prisma.application.findFirst({
			where: {
				id: (app_id),
				organization: {
					OR: [
						{ owner_id: session.user.userId },
						{
							members: {
								some: {
									role: {
										in: ['ADMIN', 'OWNER', 'DEVELOPER']
									}
								}
							}
						}
					]
				}
			}
		});
		if (!isOwner) {
			throw error(401, 'Unauthorized');
		}
	} else if (org_id) {
		const isOwner = await prisma.organization.findFirst({
			where: {
				id: (org_id),
				OR: [
					{ owner_id: session.user.userId },
					{
						members: {
							some: {
								role: {
									in: ['ADMIN', 'OWNER', 'DEVELOPER']
								}
							}
						}
					}
				]
			}
		});
		if (!isOwner) {
			throw error(401, 'Unauthorized');
		}
	}
}