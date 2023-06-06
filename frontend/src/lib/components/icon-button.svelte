<script lang="ts">
	export let icon: string;
	export let url: string = '';
	export let isButton: boolean = false;
	export let handleClick: () => void = () => undefined;
	export let target: string = '_self';
</script>

{#if isButton}
	<a href="#" {target} on:click={handleClick}>
		<i class={icon} />
	</a>
{/if}

{#if !isButton}
	<a href={url} {target}>
		<i class={icon} />
	</a>
{/if}
