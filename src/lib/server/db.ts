import { PrismaClient } from '@prisma/client';

/**
 * @variable dbInstance is used to hold the singleton instance of PrismaClient.
 * @function ensures that the instance is created only once.
 */
let dbInstance: PrismaClient;

const getDbInstance = () => {
	if (!dbInstance) {
		dbInstance = new PrismaClient();
	}
	return dbInstance;
};

const db = getDbInstance();

if (process.env.NODE_ENV === 'development') {
	// Optionally, you can enable debug logs or any other development-specific settings
}

export default db;
