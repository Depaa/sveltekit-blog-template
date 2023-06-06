<script lang="ts">
	export let open: boolean;
	export let title: string;
	export let okLabel: string;
	export let cancelLabel: string;
	export let handleOk: (attr: any) => void;
	export let handleCancel: () => void;

	const attrs = {
		alt: '',
		height: '',
		width: '',
	};

	const setAlt = (event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
		attrs.alt = (event.target as HTMLInputElement)?.value;
	};

	const setHeight = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		attrs.height = (event.target as HTMLInputElement)?.value;
	};

	const setWidth = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		attrs.width = (event.target as HTMLInputElement)?.value;
	};
</script>

{#if open}
	<div class="modal-image-attr-container">
		<div class="modal-content">
			<div class="modal-body">
				<p>{title}</p>
				<div class="post-input-container">
					<p class="caption">
						Alt: <span
							>({attrs.alt.length} characters)
							<meter min="0" max="150" low="80" high="100" optimum="0" value={attrs.alt.length} />
						</span>
					</p>
					<!-- <input class="post-input" type="text" value={attrs.alt} on:input={setAlt} /> -->
					<textarea rows="3" class="post-textarea" value={attrs.alt} on:input={setAlt} />
				</div>
				<!-- <div class="post-input-container">
				<p class="caption">Height:</p>
				<input class="post-input" type="text" value={attrs.height} on:input={setHeight} />
			</div>
			<div class="post-input-container">
				<p class="caption">Width:</p>
				<input class="post-input" type="text" value={attrs.width} on:input={setWidth} />
			</div> -->
			</div>
			<div class="modal-footer">
				<button on:click={() => handleOk(attrs)}>
					{okLabel}
				</button>
				<button on:click={handleCancel} class="secondary">
					{cancelLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
