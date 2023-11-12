/*
*
* NOT USED
* YOU NEED TO INSTALL jsontoxml
*
*/

import { DynamoDBStreamEvent, Handler, S3Event } from 'aws-lambda';
import { streamMiddleware } from '@libs/utils/handler';
import logger from '@libs/logger';
import { get, upload } from '@libs/services/s3';
import { Sitemap, Item } from './interface';
const jsonxml = require('jsontoxml');

const { BLOG_BUCKET_NAME, BLOG_CDN_URL } = process.env;

const processHandler = async (event: DynamoDBStreamEvent | S3Event) => {
	logger.info(`Received ${event.Records.length} records`);

	let jsonData: Sitemap;

	try {
		const sitemap = await get(BLOG_BUCKET_NAME, 'sitemap.json');
		jsonData = JSON.parse(sitemap);
	} catch (error) {
		logger.error(error);
		if (error.Code !== 'AccessDenied') {
			logger.error('Not access denied, nothing to do here');
			return;
		}
		// import the sitemap blueprint because it's the first time
		jsonData = require('./sitemap.json');
		const stringData = JSON.stringify(jsonData).replace(/\{BLOG_URL\}/g, `https://${BLOG_CDN_URL}`);
		logger.debug(stringData);
		jsonData = JSON.parse(stringData);
	}

	if (event.Records[0].eventSource === 'aws:s3') {
		logger.debug('aws:s3');
		for (const url of jsonData.parent[0].children) {
			const loc = url.children.find(
				(child) =>
					child.name === 'loc' &&
					(child.text === `https://${BLOG_CDN_URL}` || child.text === `https://${BLOG_CDN_URL}/blog`)
			);
			logger.debug(loc);
			if (loc) {
				for (const child of url.children) {
					if (child.name === 'lastmod') {
						logger.debug(child.text);
						child.text = new Date().toISOString();
					}
				}
			}
		}
	} else {
		logger.debug('aws:dynamodb');
		const dynamodbEvent = event as DynamoDBStreamEvent;
		for (const record of dynamodbEvent.Records) {
			const state =
				record.dynamodb.NewImage && record.dynamodb.NewImage.state && record.dynamodb.NewImage.state.S
					? record.dynamodb.NewImage.state.S
					: record.dynamodb.OldImage && record.dynamodb.OldImage.state && record.dynamodb.OldImage.state.S
					? record.dynamodb.OldImage.state && record.dynamodb.OldImage.state.S
					: 'PRIVATE';
			if (state === 'PRIVATE') {
				logger.info('private, nothing to do here');
				return;
			}

			// insert new post
			if (record.eventName === 'INSERT') {
				logger.info('insert');
				const post = record.dynamodb.NewImage;
				const url: Item = {
					name: 'url',
					children: [
						{ name: 'loc', text: `https://${BLOG_CDN_URL}/blog/${post.slug.S}` },
						{ name: 'lastmod', text: new Date().toISOString() },
						{ name: 'changefreq', text: 'weekly' },
						{ name: 'priority', text: 0.8 },
					],
				};
				logger.debug(url);

				if (post.image && post.image.S) {
					const image: Item = {
						name: 'image:image',
						children: [
							{ name: 'image:caption', text: 'Cover Image' },
							{ name: 'image:loc', text: post.image.S },
							{ name: 'image:title', text: 'Cover Image' },
						],
					};
					logger.debug(image);
					url.children.push(image);
				}
				logger.debug(url);
				jsonData.parent[0].children.push(url);
				// remove old post
			} else if (record.eventName === 'REMOVE') {
				logger.info('remove');
				const post = record.dynamodb.OldImage;
				let deleted = false;
				let i = 0;
				let childrenLength = jsonData.parent[0].children.length;
				while (!deleted && i < childrenLength) {
					logger.debug(`i: ${i}`);
					const index = jsonData.parent[0].children[i].children.findIndex(
						(child) => child.name === 'loc' && child.text === `https://${BLOG_CDN_URL}/blog/${post.slug.S}`
					);
					logger.debug(`index: ${index}`);
					if (index !== -1) {
						logger.debug(`deleting url with index ${i}`);
						jsonData.parent[0].children.splice(i, 1);
						deleted = true;
						childrenLength -= 1;
					}
					i += 1;
				}

				// remove old post and insert new one
			} else if (record.eventName === 'MODIFY') {
				logger.info('modify');
				const oldPost = record.dynamodb.OldImage;
				const newPost = record.dynamodb.NewImage;

				let deleted = false;
				let i = 0;
				let childrenLength = jsonData.parent[0].children.length;
				while (!deleted && i < childrenLength) {
					logger.debug(`i: ${i}`);
					const index = jsonData.parent[0].children[i].children.findIndex(
						(child) => child.name === 'loc' && child.text === `https://${BLOG_CDN_URL}/blog/${oldPost.slug.S}`
					);
					logger.debug(`index: ${index}`);
					if (index !== -1) {
						logger.debug(`deleting url with index ${i}`);
						jsonData.parent[0].children.splice(i, 1);
						deleted = true;
						childrenLength -= 1;
					}
					i += 1;
				}
				const url: Item = {
					name: 'url',
					children: [
						{ name: 'loc', text: `https://${BLOG_CDN_URL}/blog/${newPost.slug.S}` },
						{ name: 'lastmod', text: new Date().toISOString() },
						{ name: 'changefreq', text: 'weekly' },
						{ name: 'priority', text: 0.8 },
					],
				};
				logger.debug(url);
				if (newPost.image && newPost.image.S) {
					const image: Item = {
						name: 'image:image',
						children: [
							{ name: 'image:caption', text: 'Cover Image' },
							{ name: 'image:loc', text: newPost.image.S },
							{ name: 'image:title', text: 'Cover Image' },
						],
					};
					logger.debug(image);
					url.children.push(image);
				}
				logger.debug(url);
				jsonData.parent[0].children.push(url);
			}
		}
	}
	logger.debug(jsonData);
	await upload(BLOG_BUCKET_NAME, 'sitemap.json', 'json', JSON.stringify(jsonData));
	const xmlData = jsonxml(jsonData.parent, { xmlHeader: true });
	console.debug(xmlData);
	await upload(BLOG_BUCKET_NAME, 'sitemap.xml', 'xml', xmlData, 'public,max-age=3600');
};

export const handler: Handler = streamMiddleware(processHandler);
