<script lang="ts">
  import * as O from 'fp-ts/Option';
  import * as E from 'fp-ts/Either';
  import {pipe} from "fp-ts/function";
  import {validate, type LocationData} from "../logic/validation";
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher<LocationData>();

  async function load(data: O.Option<string>) {
    pipe(
      validate(data),
      E.match(
        (err) => console.error(err),
        (json) => dispatch('locations', json.locations) as any,
      )
    )
  }
</script>

<div class="loader">
  <input type="file" accept="application/json"
         on:change={async e => await load(O.fromNullable(await e.target.files[0]?.text()))} />
</div>
