import db from '$lib/server/db';

//put your handler here

// Ensure PrismaClient disconnect on app shutdown
process.on('beforeExit', async () => {
	await db.$disconnect();
});

process.on('SIGINT', async () => {
	await db.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await db.$disconnect();
	process.exit(0);
});
