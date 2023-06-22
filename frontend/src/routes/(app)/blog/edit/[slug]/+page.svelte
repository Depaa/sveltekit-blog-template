<script lang="ts">
	import { authGuard } from '$lib/auth/auth';
	import IconButton from '$lib/components/icon-button.svelte';
// import MarkupTextEditor from '$lib/components/markup-text-editor.svelte';
	import Modal from '$lib/components/modal.svelte';
	import Tag from '$lib/components/tag.svelte';
	import Toggle from '$lib/components/toggle.svelte';
	import { uploadFile } from '$lib/services/image';
	import type UpdateBlogPost from '$lib/services/interfaces/UpdateBlogPost';
	import { createPresignedUrl, publishPost, updatePost } from '$lib/services/posts';
	import { addToast } from '$lib/services/toasts';
	import type { Seo } from '$lib/types/BlogPost';
	import '$lib/types/CustomEvent';
	import type Data from '$lib/types/Data';
	import { onMount } from 'svelte';

	export let data: Data;

	let Editor: ConstructorOfATypedSvelteComponent;
	onMount(async () => {
		import('$lib/components/markup-text-editor.svelte').then(res => Editor = res.default)
	});

	let content = data.post.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	let contentMd = data.post.contentMd;
	let fileInput: HTMLInputElement;
	let files: FileList;
	let isSubmitting = false;

	let openedSection = 'content';
	let openModal = false;

	let contentLenght = 0;

	const newData: UpdateBlogPost = {
		slug: data.post.slug,
		title: data.post.title,
		description: data.post.description,
		tags: data.post.tags || [],
		content,
		contentMd,
		featured: data.post.featured,
	};

	const newSeoData: Seo = {
		title: data.post.seo?.title || '',
		description: data.post.seo?.description || '',
		tags: data.post.seo?.tags || [],
	};

	const handleContentChange = (event: CustomEvent<{ html: string; md: string; text: string }>) => {
		contentLenght = event.detail.text.length;
		contentMd = event.detail.md;
		newData.content = event.detail.html;
	};

	const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
		var binary = '';
		var bytes = new Uint8Array(buffer);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};

	const uploadImage = async (event: CustomEvent<ObserverEventDetails>) => {
		isSubmitting = true;
		const token = await authGuard().getToken();
		const file = (event.target as HTMLInputElement)?.files![0];
		const reader = new FileReader();
		const { signedUrl } = await createPresignedUrl(fetch, token, { type: file.type }, data.post.id);

		reader.readAsArrayBuffer(file);
		reader.onloadend = async () => {
			try {
				data.post.image =
					'data:' + file.type + ';base64,' + arrayBufferToBase64(reader.result as ArrayBuffer);
				await uploadFile(fetch, signedUrl, reader.result as ArrayBuffer, file.type);
				isSubmitting = false;
				addToast('success', 'Image uploaded correctly!');
			} catch (error) {
				console.error(error);
				addToast('error', 'Error on image uploading');
			}
		};
	};

	const handleSave = async () => {
		try {
			const userToken = await authGuard().getToken();
			if (newSeoData.title && newSeoData.description && newSeoData.tags.length > 0) {
				newData.seo = newSeoData;
			}
			await updatePost(fetch, userToken, data.post.id, newData);
			addToast('success', 'Post uploaded correctly!');
		} catch (error) {
			console.error(error);
			addToast('error', 'Error on post uploading');
		}
	};

	const onConfirm = async () => {
		const token = await authGuard().getToken();
		try {
			await publishPost(fetch, token, data.post.id);
			openModal = false;
			addToast('success', 'Done!');
		} catch (error) {
			console.error(error);
			addToast('error', 'Error.');
		}
	};

	const createTag = (
		event: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (event.key === 'Enter' && event.target) {
			if (newData.tags.length < 5) {
				newData.tags = [...newData.tags, (event.target as HTMLInputElement)?.value];
				(event.target as HTMLInputElement).value = '';
			} else {
				addToast('error', 'Max 5 tags.');
			}
		}
	};

	const createSeoTag = (
		event: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (event.key === 'Enter' && event.target) {
			if (newSeoData.tags.length < 5) {
				newSeoData.tags = [...newSeoData.tags, (event.target as HTMLInputElement)?.value];
				(event.target as HTMLInputElement).value = '';
			} else {
				addToast('error', 'Max 5 tags.');
			}
		}
	};

	const onChangeSlug = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (event.currentTarget.value && typeof event.currentTarget.value !== 'undefined') {
			const isValid = new RegExp(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*-?$/).test(
				(event.currentTarget as HTMLInputElement).value
			);
			if (isValid) {
				newData.slug = (event.currentTarget as HTMLInputElement).value;
			} else {
				event.currentTarget.value = newData.slug?.toString() || '';
			}
		}
	};

	const onChangeTitle = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		newData.title = (event?.currentTarget as HTMLInputElement)?.value;
	};

	const onChangeDescription = (
		event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }
	) => {
		newData.description = (event?.currentTarget as HTMLTextAreaElement)?.value;
	};

	const onChangeSEOTitle = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		newSeoData.title = (event?.currentTarget as HTMLInputElement)?.value;
	};

	const onChangeSEODescription = (
		event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }
	) => {
		newSeoData.description = (event?.currentTarget as HTMLTextAreaElement)?.value;
	};
</script>

<div class="container">
	<div class="post-header">
		<div class="post-tabs">
			<button
				class={openedSection === 'content' ? 'tab tab-active' : 'tab'}
				on:click={() => (openedSection = 'content')}>Content</button
			>
			<button
				class={openedSection === 'images' ? 'tab tab-active' : 'tab'}
				on:click={() => (openedSection = 'images')}>Images</button
			>
			<button
				class={openedSection === 'seo' ? 'tab tab-active' : 'tab'}
				on:click={() => (openedSection = 'seo')}>SEO</button
			>
		</div>
		{#if data.post.state !== 'PUBLIC'}
			<div class="post-publish-button">
				<button on:click={() => (openModal = true)}><i class="fa fa-share" /> Publish</button>
			</div>
		{/if}
	</div>
	<div class="post-body">
		{#if openedSection === 'content'}
			<div class="content-section">
				<div class="post-input-container">
					<p class="caption">
						Title: <span
							>({newData.title.length} characters)
							<meter
								min="0"
								max="100"
								low="50"
								high="60"
								optimum="0"
								value={newData.title.length}
							/>
						</span>
					</p>
					<input
						class="post-input post-title"
						type="text"
						value={newData.title}
						on:input={onChangeTitle}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">
						Description: <span>
							({newData.description?.length} characters)
							<meter
								min="0"
								max="200"
								low="150"
								high="160"
								optimum="0"
								value={newData.description?.length}
							/>
						</span>
					</p>
					<textarea
						rows="3"
						class="post-textarea"
						value={newData.description}
						on:input={onChangeDescription}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">Slug: <span>({newData.slug?.length} characters)</span></p>
					<input class="post-input" type="text" value={newData.slug} on:input={onChangeSlug} />
				</div>
				<div class="post-input-container">
					<p class="caption">Tags:</p>
					<div class="post-tags">
						{#each newData.tags as tag}
							<Tag>
								{tag}
								<IconButton
									isButton
									icon="fa fa-times"
									handleClick={() => (newData.tags = newData.tags.filter((t) => t !== tag))}
								/>
							</Tag>
						{/each}
					</div>
					<input class="post-input" type="text" on:keypress={createTag} />
				</div>
				<div class="post-input-container">
					<p class="caption">Featured:</p>
					<Toggle
						value={newData.featured === 'true'}
						onChangeValue={() => (newData.featured === 'true' ? 'false' : 'true')}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">Content: <span>({contentLenght} characters)</span></p>
					<!-- <MarkupTextEditor content={contentMd} on:change={handleContentChange} /> -->
					<svelte:component this="{Editor}" content={contentMd} on:change={handleContentChange} />
				</div>
			</div>
		{/if}
		{#if openedSection === 'images'}
			<div class="images-section">
				<div class="post-upload-container">
					<p class="caption">Image:</p>
					<input
						class="hidden"
						id="file-to-upload"
						type="file"
						accept=".png,.jpg,.jpeg,.svg"
						bind:files
						bind:this={fileInput}
						on:change={(e) => uploadImage(e)}
					/>
					<button class="upload-btn" disabled={isSubmitting} on:click={() => fileInput.click()}
						>Upload</button
					>
				</div>
				<div class="image-preview">
					<img alt="Cover" src={data.post.image} />
				</div>
			</div>
		{/if}
		{#if openedSection === 'seo'}
			<div class="content-section">
				<div class="post-input-container">
					<p class="caption">
						Title: <span>
							({newSeoData.title?.length} characters)
							<meter
								min="0"
								max="100"
								low="50"
								high="60"
								optimum="0"
								value={newSeoData.title.length}
							/>
						</span>
					</p>
					<input
						class="post-input post-title"
						type="text"
						value={newSeoData.title}
						on:input={onChangeSEOTitle}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">
						Description: <span>
							({newSeoData.description?.length} characters)
							<meter
								min="0"
								max="200"
								low="150"
								high="160"
								optimum="0"
								value={newSeoData.description?.length}
							/>
						</span>
					</p>
					<textarea
						rows="3"
						class="post-textarea"
						value={newSeoData.description}
						on:input={onChangeSEODescription}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">Tags:</p>
					<div class="post-tags">
						{#each newSeoData?.tags as tag}
							<Tag
								>{tag}
								<IconButton
									isButton
									icon="fa fa-times"
									handleClick={() => (newSeoData.tags = newSeoData.tags.filter((t) => t !== tag))}
								/></Tag
							>
						{/each}
					</div>
					<input class="post-input" type="text" on:keypress={createSeoTag} />
				</div>
			</div>
		{/if}
	</div>

	<div class="post-footer">
		<button on:click={handleSave}><i class="fa fa-save" /> Save</button>
	</div>
</div>
<Modal
	title="Do you want to publish the post?"
	open={openModal}
	okLabel="Confirm"
	cancelLabel="Cancel"
	handleCancel={() => {
		openModal = false;
	}}
	handleOk={onConfirm}
/>