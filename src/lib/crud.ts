import type { Prisma, PrismaClient } from '@prisma/client';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from 'src/lib/server/prisma.js';
import { is_authorized } from './security/is_authorized';
import { object_entries } from './utils/object_helpers';

function object_entries<T extends object>(obj: T) {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function object_keys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof T)[];
}

// key of PrismaClient if the value is an object
const prisma_methods = ['$connect' , '$disconnect' , '$on' , '$use' , '$request' , '$transaction' , '$executeRaw' , '$executeRawUnsafe' , '$extends' , '$queryRaw' , '$queryRawUnsafe'>]

// pick all except methods
type Models = Pick<PrismaClient, Exclude<keyof PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$request' | '$transaction' | '$executeRaw' | '$executeRawUnsafe' | '$extends' | '$queryRaw' | '$queryRawUnsafe'>>;


type CrudMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class CrudController {
	private model: keyof Models;
    private methods: CrudMethods[];
    private authorized: boolean;
    private key: string
    private param?: string

	constructor({model, methods, authorized, key, param}: {model: keyof Models, methods: CrudMethods[], authorized: boolean, key: string, param: string}) {
		this.model = model;
        this.methods = methods;
        this.authorized = authorized;
        this.key = key
        this.param = param
		
	}

	validateSession = async (locals: RequestEvent['locals']) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		return session;
	};

	GET = async ({ locals, params, url }: RequestEvent) => {
		const session = await this.validateSession(locals);
        const id = url.searchParams.get('id');
        const page = url.searchParams.get('page') ?? undefined
        const limit = url.searchParams.get('limit');
        const sortBy = (url.searchParams.get('sortBy') ?? undefined) as
            | {
                    sortBy: string;
                    sortDirection: string;
              }
            | undefined;


        const model = prisma[this.model] as Models[keyof Models]

        if (this.authorized) {
            await is_authorized(session, params.org_id, params.app_id)
        }

		const data = await model.findMany({
			where: {
				[this.key]: params[this.param]
			},
            page: page ? parseInt(page) : 1,
		    limit: limit ? parseInt(limit) : undefined,
		    sortBy: sortBy ? sortBy : undefined
		});

		return json(data);
	};

    POST = async ({ locals, params, request }: RequestEvent) => {
        const session = await this.validateSession(locals);
        const model = prisma[this.model] as Models[keyof Models]

        if (this.authorized) {
            await is_authorized(session, params.org_id, params.app_id)
        }

        const payload = await request.json() as PrismaClient[typeof this.model]['create']['data']

        const data = await model.create({
            data: {
                [this.key]: params[this.param],
                ...payload
            }
        });

        return json(data);
    };

    PUT = async ({ locals, params, request }: RequestEvent) => {
        const session = await this.validateSession(locals);
        const model = prisma[this.model] as Models[keyof Models]

        if (this.authorized) {
            await is_authorized(session, params.org_id, params.app_id)
        }

        const payload = await request.json() as PrismaClient[typeof this.model]['update']['data']

        const data = await model.update({
            where: {
                [this.key]: params[this.param],
            },
            data: {
                ...payload
            }
        });

        return json(data);
    };

    DELETE = async ({ locals, params, request, url }: RequestEvent) => {
        const session = await this.validateSession(locals);
        const model = prisma[this.model] as Models[keyof Models]

        if (this.authorized) {
            await is_authorized(session, params.org_id, params.app_id)
        }

        const id = url.searchParams.get('id');

        if (!id) {
            throw error(400, 'Missing id');
        }

        const data = await model.delete({
            where: {
                [this.key]: params[this.param],
            }
        });

        return json(data);
    };

    PATCH = async ({ locals, params, request, url }: RequestEvent) => {
        const session = await this.validateSession(locals);
        const model = prisma[this.model] as Models[keyof Models]

        if (this.authorized) {
            await is_authorized(session, params.org_id, params.app_id)
        }

        const id = url.searchParams.get('id');

        if (!id) {
            throw error(400, 'Missing id');
        }

        const payload = await request.json() as PrismaClient[typeof this.model]['update']['data']

        const data = await model.update({
            where: {
                [this.key]: params[this.param],
            },
            data: {
                ...payload
            }
        });

        return json(data);
    };

    

	// Similarly define PUT, DELETE, PATCH here...
}

