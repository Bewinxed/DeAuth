import { error, json } from "@sveltejs/kit";
import { is_authorized } from "src/lib/security/is_authorized";
import { prisma } from "src/lib/server/prisma.js";

export const DELETE = async ({ locals, params }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    await is_authorized(session, params.org_id, params.app_id)

    console.log(params.permission_id)

    const resource_permission = await prisma.appPermissionAssignment.delete({
        where: {
            id: parseInt(params.permission_id),
        }
    });
    return json({ id: resource_permission.id });
}