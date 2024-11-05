import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateId } from 'lucia';
import { json } from '@sveltejs/kit';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '$env/static/private';
import * as ImageService from '$lib/server/services/image.service';
import type { RequestHandler } from './$types';

const minIOClient = new S3Client({
	endpoint: 'https://minio-gw8go8o0wkkg0cosk08gkw8o.51.79.156.25.sslip.io',
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID!,
		secretAccessKey: AWS_SECRET_ACCESS_KEY!
	},
	forcePathStyle: true
});

const BUCKET_NAME = 'test-s3-bucket';
// const s3Region = s3Client.config.region;

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('image') as File | null;

	if (!file) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	const fileName = `${generateId(5)}-${file.name}`;

	try {
		const arrayBuffer = await file.arrayBuffer();
		const fileContent = new Uint8Array(arrayBuffer);

		const uploadParams = {
			Bucket: BUCKET_NAME,
			Key: fileName,
			Body: fileContent
		};

		const command = new PutObjectCommand(uploadParams);
		await minIOClient.send(command);

		// Save image metadata to database
		const newImage = await ImageService.createImageMetadata({
			id: generateId(15),
			fileName: fileName
		});

		return json({ message: 'Image uploaded successfully!', image: newImage });
	} catch (error) {
		console.error('Error uploading file:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const images = await ImageService.getImages();

		if (!images || images.length === 0) {
			return json({ files: [] });
		}

		// Map over imageContents to generate an array of promises for pre-signed URLs
		const imageMetadataPromises = images.map(async (file) => {
			if (!file.fileName) {
				console.warn('Missing fileName for an image entry:', file);
				return null;
			}

			const imageUrl = await generatePresignedUrl(BUCKET_NAME, file.fileName);

			return imageUrl;
		});

		// Wait for all promises to resolve
		const imageMetadata = (await Promise.all(imageMetadataPromises)).filter(Boolean);

		return json({ files: imageMetadata });
	} catch (error) {
		console.error('Error retrieving images from S3', error);
		return json({ error: 'Failed to retrieve images from S3' }, { status: 500 });
	}
};

// Generated pre-signed url will expire in 1 hour
async function generatePresignedUrl(bucket: string, key: string) {
	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
	const url = await getSignedUrl(minIOClient, command, { expiresIn: 3600 });
	return url;
}
