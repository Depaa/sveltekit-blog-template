<script lang="ts">
	import { authGuard } from '$lib/auth/auth';
	import { uploadFile } from '$lib/services/image';
	import { createPresignedUrl } from '$lib/services/posts';
	import type Quill from 'quill';
	import { createEventDispatcher, onMount } from 'svelte';
	import ImageAttrModal from './image-attr-modal.svelte';

	let editor: string | Element;
	export let content: string;
	let quill: Quill;
	let openModal = false;
	let file: File;

	let previewContent = '';

	const dispatch = createEventDispatcher();

	function onChange() {
		dispatch('change', {
			html: content,
			text: previewContent,
		});
	}

	const imageHandler = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.click();

		// Listen upload local image and save to server
		input.onchange = async () => {
			file = input!.files![0];
			openModal = true;
			// const reader = new FileReader();
			// let signedUrl = '';
			// let imageUrl = '';
			// const token = await authGuard().getToken();
			// const presignedUrl = await createPresignedUrl(fetch, token, {
			// 	type: file.type,
			// });
			// signedUrl = presignedUrl.signedUrl;
			// imageUrl = presignedUrl.image;
			// reader.readAsArrayBuffer(file);
			// reader.onloadend = async () => {
			// 	try {
			// 		const img = document.createElement('img');
			// 		img.setAttribute('width', '50');
			// 		img.setAttribute('height', '50');
			// 		img.setAttribute('loading', 'lazy');
			// 		img.setAttribute('alt', 'alt di prova');
			// 		await uploadFile(fetch, signedUrl, reader.result as ArrayBuffer, file.type);
			// 		img.setAttribute('src', imageUrl);

			// 		quill.root.innerHTML = [quill.root.innerHTML, img.outerHTML].join('');
			// 	} catch (error) {
			// 		console.error(error);
			// 	}
			// };
		};
	};

	const confirmModal = async (attrs: any) => {
		openModal = false;
		const reader = new FileReader();
		let signedUrl = '';
		let imageUrl = '';
		const token = await authGuard().getToken();
		const presignedUrl = await createPresignedUrl(fetch, token, {
			type: file.type,
		});
		signedUrl = presignedUrl.signedUrl;
		imageUrl = presignedUrl.image;
		reader.readAsArrayBuffer(file);
		reader.onloadend = async () => {
			try {
				const img = document.createElement('img');
				img.onload = async () => {
					img.setAttribute('width', img.naturalHeight.toString());
					img.setAttribute('height', img.naturalHeight.toString());
					img.setAttribute('loading', 'lazy');
					img.setAttribute('alt', attrs.alt);

					quill.root.innerHTML = [quill.root.innerHTML, img.outerHTML].join('');
				};
				await uploadFile(fetch, signedUrl, reader.result as ArrayBuffer, file.type);
				img.setAttribute('src', imageUrl);
			} catch (error) {
				console.error(error);
			}
		};
	};

	export let toolbarOptions = [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		['blockquote', 'link', 'image', 'video', 'code-block'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ align: [] }],
		// [{ script: 'sub' }, { script: 'super' }],
		// [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		// [{ direction: 'rtl' }], // text direction
		// [{ color: [] }, { background: [] }], // dropdown with defaults from theme
		// ['clean'],
	];

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(editor, {
			modules: {
				toolbar: {
					container: toolbarOptions,
					handlers: {
						image: imageHandler,
					},
				},
			},
			theme: 'bubble',
			placeholder: 'No data...',
		});

		quill.root.innerHTML = content;
		let changes = false;
		quill.on('text-change', () => {
			changes = true;
			content = quill.root.innerHTML;
			previewContent = quill.getText();
			onChange();
		});
	});
</script>

<div class="editor-wrapper">
	<div bind:this={editor} />
</div>

<ImageAttrModal
	title="Insert image attributes:"
	open={openModal}
	okLabel="Confirm"
	cancelLabel="Cancel"
	handleCancel={() => {
		openModal = false;
	}}
	handleOk={confirmModal}
/>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.bubble.css';
</style>
