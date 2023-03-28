<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  async function onFileSelected(event: { target: HTMLInputElement }) {
    if (!event.target.files?.length) return;
    const text = await event.target.files.item(0).text();
    try {
      const json = JSON.parse(text);
      dispatch('data', json);
    }
    catch (e) { console.error(e) }
  }
</script>

<div class="loader">
  <input type="file" accept="application/json" on:change={e => onFileSelected(e)}/>
</div>
