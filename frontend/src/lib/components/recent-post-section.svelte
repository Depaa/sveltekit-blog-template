<!-- 
- Author: Matt Fantinel
-	https://github.com/matfantinel
-->
<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="section-container">
	<div class="title-area">
		<div class="text">
			<h2>Recent Posts</h2>
		</div>
		<button class="primary" on:click={() => goto('/blog')}> Blog </button>
	</div>
	<div class="content-area">
		<slot />
	</div>
</div>

<style lang="scss">
	@import '../scss/breakpoints.scss';

	.section-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 40px;
		padding: 50px 0;

		.title-area {
			flex: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			gap: 15px;

			.text {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 5px;
			}
		}
		.content-area {
			flex: 5;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		@include for-phone-only {
			flex-direction: column;
		}
	}
</style>
