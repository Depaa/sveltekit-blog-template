<script>
</script>

<div class="socials">
	<a href="https://github.com/Depaa" target="_blank" rel="noreferrer">
		<i class="fa fa-github" />
	</a>
	<a
		href="https://www.linkedin.com/in/matteo-depascale-337297183/"
		target="_blank"
		rel="noreferrer"
	>
		<i class="fa fa-linkedin" />
	</a>
</div>

<style lang="scss">
	@import '../scss/breakpoints.scss';
	.socials {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	a {
		color: var(--secondary-color-contrast);
		fill: var(--secondary-color-contrast);
		&:hover {
			color: var(--link-highlight-color);
			fill: var(--link-highlight-color);
		}
	}
	a i {
		font-size: 30px;
	}
</style>
