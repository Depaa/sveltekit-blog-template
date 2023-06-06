import {
	S3Client,
	PutObjectCommand,
	PutObjectCommandInput,
	PutObjectRequest,
	PutObjectCommandOutput,
	GetObjectCommandInput,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '@libs/logger';

const client = new S3Client({ region: process.env.REGION });

const createSignedUrl = async (
	key: string,
	type: string,
	bucketName: string,
	cacheControl?: string
): Promise<string> => {
	const params: PutObjectCommandInput = {
		Bucket: bucketName,
		Key: key,
		ContentType: type,
		CacheControl: cacheControl,
	};
	logger.debug(params);

	const putObjectCommand = new PutObjectCommand(params);
	const res = await getSignedUrl(client, putObjectCommand, { expiresIn: 60 * 5 });
	logger.info(`Done getting signed url for put object to ${bucketName}`);
	logger.debug(res);
	return res;
};

const upload = async (
	bucketName: string,
	key: string,
	type: string,
	body: PutObjectRequest['Body'] | string | Uint8Array | Buffer,
	cacheControl?: string
): Promise<PutObjectCommandOutput> => {
	const params: PutObjectCommandInput = {
		Bucket: bucketName,
		Key: key,
		Body: body,
		ContentType: type,
		CacheControl: cacheControl,
	};
	logger.debug(params);
	const putObjectCommand = new PutObjectCommand(params);
	const res = await client.send(putObjectCommand);
	logger.info(`Done putting object ${key} to ${bucketName}`);
	logger.debug(res, false);
	return res;
};

const get = async (bucketName: string, key: string): Promise<string> => {
	const params: GetObjectCommandInput = {
		Bucket: bucketName,
		Key: key,
	};
	logger.debug(params);
	const getObjectCommand = new GetObjectCommand(params);
	const res = await client.send(getObjectCommand);
	logger.info(`Done getting object ${key} from ${bucketName}`);
	const object = await res.Body.transformToString();
	logger.debug(object, false);
	return object;
};

export { createSignedUrl, upload, get };
