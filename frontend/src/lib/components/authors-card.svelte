<script lang="ts">
	import type { Author } from "$lib/types/BlogPost";

  export let authors: Author[] = [];

</script>

<div class="author-container">
  {#each authors as author, index (author.name)}
    <div class="author-card" class:author-left={(index % 2 === 0)} class:author-right={(index % 2 === 1)}>
      <img class="author-photo" src={author.imageUrl} alt={author.name}>
      <div class="author-details">
        <h3>{author.name}</h3>
        <p>{author.description}</p>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @import '../scss/breakpoints.scss';
  .author-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .author-card {
    width: 48%; /* Adjust as needed */
    margin-bottom: 20px;
    display: flex;
    // align-items: center; /* Center items vertically */
  }

  .author-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0;
  }

  .author-left {
    justify-content: flex-start;
  }

  .author-right {
    justify-content: flex-end;
    flex-direction: row-reverse;
    text-align: end;
  }

  .author-details {
    margin-left: 10px; /* Add margin to the left for left alignment */
    margin-right: 10px; /* Add margin to the right for right alignment */
  }
</style>