<script lang="ts">
  import Loader from "./components/Loader.svelte";
  import L from 'leaflet';
  import type {ActionReturn} from "svelte/action";

  let map: L.Map;

  let loaderComponent: Loader;
  const loader = new L.Control({ position: 'topright'});
  loader.onAdd = (map: L.Map) => {
    const target = L.DomUtil.create('div');
    loaderComponent = new Loader({ target, props: {} });
    return target;
  }

  function createMap(container: HTMLElement): L.Map {
    return L.map(container, {preferCanvas: true})
      .setView([39.8283, -98.5795], 5)
      .addLayer(L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ))
      .addControl(loader);
  }

  function mapAction(container: HTMLElement): ActionReturn {
    map = createMap(container);
    return {
      destroy: () => {
        map.remove();
        map = null;
      }
    }
  }

</script>

<div class="map" use:mapAction></div>

<style>
  .map {
      height: 100%;
      width: 100%;
  }
</style>