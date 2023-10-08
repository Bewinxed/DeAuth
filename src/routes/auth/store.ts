import type { Prisma } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';

export type UserWithProfile = Prisma.UserGetPayload<object> & {
	signature?: string;
};

const createFunction = (user: UserWithProfile) => {
	// if (!user.profile) {
	// 	user.profile = {}
	// }
	return () => writable<UserWithProfile>(user);
};

export const createUserProfileContext: (user: UserWithProfile) => () => Writable<UserWithProfile> =
	createFunction;
