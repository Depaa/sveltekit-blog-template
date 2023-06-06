const uploadFile = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	url: string,
	file: ArrayBuffer,
	contentType: string
) => {
	console.time(`uploading-file`);
	const res = await fetch(url, {
		method: 'PUT',
		body: file,
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'max-age=31536000,public' //one year for images
		},
	});
	console.info('File uploaded');
	console.timeEnd(`uploading-file`);
	console.debug(res);
};

export { uploadFile };
