<script lang="ts">
  import L from 'leaflet';

  let map: L.Map;

  function createMap(container: HTMLElement): L.Map {
    return L.map(container, {preferCanvas: true})
      .setView([39.8283, -98.5795], 5)
      .addLayer(L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ));
  }

  function mapAction(container: HTMLElement) {
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