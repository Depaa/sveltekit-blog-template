<!-- 
- Author: Matt Fantinel
-	https://github.com/matfantinel
-->

<div class="grid-container">
	<slot />
</div>

<style lang="scss">
	@import '../scss/breakpoints.scss';

	.grid-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 20px;
		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}
	}
</style>
