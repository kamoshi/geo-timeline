<script lang="ts">
  import * as O from 'fp-ts/Option';
  import * as E from 'fp-ts/Either';
  import {pipe} from "fp-ts/function";
  import {parse, type LocationData} from "../logic/parsing";
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher<LocationData>();
  
  async function load(data: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    pipe(
      O.fromNullable(await data.currentTarget.files?.item(0)?.text()),
      parse,
      E.match(
        (err) => console.error(err),
        (json) => dispatch('locations', json.locations),
      )
    )
  }
</script>

<div class="loader">
  <input type="file" accept="application/json" on:change={load} />
</div>
