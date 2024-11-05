import db from '$lib/server/db';
import type { Image } from '@prisma/client';

export const createImageMetadata = async (image: Image) => {
	return await db.image.create({ data: image, select: { id: true, fileName: true } });
};

export const getImages = async () => {
	return await db.image.findMany({
		select: { id: true, fileName: true }
	});
};
