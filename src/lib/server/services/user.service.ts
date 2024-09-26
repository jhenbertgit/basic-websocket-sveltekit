import db from '$lib/server/db';
import type { User } from '@prisma/client';

export const createUser = async (user: Omit<User, 'createdAt' | 'updatedAt'>) => {
	return await db.user.create({ data: user, select: { id: true, username: true, password: true } });
};

export const getAllUsers = async () => {
	return await db.user.findMany({
		select: { id: true, username: true, createdAt: true, updatedAt: true }
	});
};
