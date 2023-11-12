<script lang="ts">
	import { authGuard } from '$lib/auth/auth';
	import { uploadFile } from '$lib/services/image';
	import { createPresignedUrl } from '$lib/services/posts';
	import DOMPurify from 'dompurify';
	import EasyMDE from 'easymde';
	import { createEventDispatcher, onMount } from 'svelte';
	import ImageAttrModal from './image-attr-modal.svelte';

	let editor: HTMLElement | null;
	export let content: string;
	let openModal = false;
	let file: File;
	let easyMDE: EasyMDE;

	let previewContent = '';

	addEventListener("scroll", (event) => {
		const editor = document.querySelector<HTMLElement>('.EasyMDEContainer')
		const toolbar = document.querySelector<HTMLElement>('.editor-toolbar');
		if (toolbar && editor) {
			const rect = toolbar.getBoundingClientRect();
			const editorRect = editor?.getBoundingClientRect()
			if (rect.bottom < window.screenTop) {
				toolbar.classList.add("fixed-toolbar");
			} else if (editorRect.top > 0 ) {
					toolbar.classList.remove("fixed-toolbar")
				}
			}
		}
	);
	
	const dispatch = createEventDispatcher();

	onMount(async () => {
		editor = document.getElementById('markdown-editor');
		if (editor) {
			easyMDE = new EasyMDE({
				element: editor,
				theme: 'easymde',
				hideIcons: ['guide', 'fullscreen', 'side-by-side', 'heading', 'image'],
				showIcons: ['code', 'heading-1', 'heading-2', 'heading-3', 'undo', 'redo', 'upload-image'],
				initialValue: content,
				placeholder: 'Type here your markdown text...',
				previewImagesInEditor: true,
				imageUploadFunction: (file, onSuccess, onError) => imageHandler(file, onSuccess, onError),
				renderingConfig: {
					singleLineBreaks: false,
					codeSyntaxHighlighting: true,
					sanitizerFunction: (renderedHTML) => {
						return DOMPurify.sanitize(renderedHTML);
					},
				},
				blockStyles: {
					italic: '_',
				},
			});
		}

		easyMDE.codemirror.on('change', () => {
			const contentMd = easyMDE.value();
			content = easyMDE.markdown(easyMDE.value().replaceAll('\\n', '<br/>'));
			dispatch('change', {
				html: content,
				md: contentMd,
				text: previewContent,
			});
		});
	});

	const imageHandler = (
		fileHandler: File,
		onSuccess: (imageUrl: string) => void,
		onError: (errorMessage: string) => void
	) => {
		console.log('imageHandler');
		file = fileHandler;
		openModal = true;
	};


	/*
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
	*/
	const confirmModal = async (attrs: any) => {
		console.log('attrs', attrs);
		console.log('file', file);
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
					var pos = easyMDE.codemirror.getCursor();
					easyMDE.codemirror.setSelection(pos, pos);
					easyMDE.codemirror.replaceSelection(`![${attrs.alt}](${imageUrl})`);
				};
				await uploadFile(fetch, signedUrl, reader.result as ArrayBuffer, file.type);
				img.setAttribute('src', imageUrl);
			} catch (error) {
				console.error(error);
			}
		};		
	};
</script>

<div class="editor-wrapper">
	<textarea id="markdown-editor" />
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
