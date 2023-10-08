import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export function prisma_exclude<T, Key extends keyof T>(
	obj: T,
	keys: Key[]
  ): Omit<T, Key> {
	return Object.fromEntries(
	  Object.entries(obj).filter(([key]) => !keys.includes(key))
	)
  }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient().$extends({
		query: {
			$allModels: {
				async $allOperations({ operation, model, args, query }) {
					const start = performance.now();
					const result = await query(args);
					const end = performance.now();
					const time = end - start;
					// console.log(
					// 	util.inspect(
					// 		{ model, operation, args, time },
					// 		{ showHidden: false, depth: null, colors: true }
					// 	)
					// );
					return result;
				}
			}
		}
	});

if (dev) globalForPrisma.prisma = prisma;
