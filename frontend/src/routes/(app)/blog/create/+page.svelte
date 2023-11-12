<script lang="ts">
	import { goto } from '$app/navigation';
	import { authGuard } from '$lib/auth/auth';
	import IconButton from '$lib/components/icon-button.svelte';
	import MarkupTextEditor from '$lib/components/markup-text-editor.svelte';
	import Tag from '$lib/components/tag.svelte';
	import Toggle from '$lib/components/toggle.svelte';
	import type CreateBlogPost from '$lib/services/interfaces/CreateBlogPost';
	import { createPost } from '$lib/services/posts';
	import { addToast } from '$lib/services/toasts';
	import type { Seo } from '$lib/types/BlogPost';
	import '$lib/types/CustomEvent';

	let openedSection = 'content';

	const newData: CreateBlogPost = {
		title: '',
		description: '',
		tags: [],
		content: '',
		contentMd: '',
		featured: 'false',
	};

	const newSeoData: Seo = {
		title: '',
		description: '',
		tags: [],
	};

	const handleContentChange = (event: CustomEvent<{ html: string; md: string; text: string }>) => {
		newData.content = event.detail.html;
		newData.contentMd = event.detail.md;
	};

	const handleSave = async () => {
		try {
			const userToken = await authGuard().getToken();
			newData.seo = newSeoData;
			let res = await createPost(fetch, userToken, newData);
			addToast('success', 'Done!');
			goto('/blog/edit/' + res.data.id);
		} catch (error) {
			console.error(error);
			addToast('error', 'Error on post creating');
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
				class={openedSection === 'seo' ? 'tab tab-active' : 'tab'}
				on:click={() => (openedSection = 'seo')}>SEO</button
			>
		</div>
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
						onChangeValue={() => newData.featured = newData.featured === 'true' ? 'false' : 'true'}
					/>
				</div>
				<div class="post-input-container">
					<p class="caption">Content:</p>
					<MarkupTextEditor content={newData.contentMd} on:change={handleContentChange} />
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
