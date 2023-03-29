<script lang="ts">
  import L from 'leaflet';
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  import 'leaflet.markercluster';
  import {MarkerClusterGroup} from 'leaflet';
  import Loader from "./components/Loader.svelte";

  let map: L.Map;
  let cluster: L.LayerGroup;

  function onLoadLocations(event: CustomEvent<GeoLocation[]>) {
    if (!map) return;
    const newCluster = new MarkerClusterGroup();
    const markers = event.detail.map(l => L.marker([+l.latitudeE7/10000000, +l.longitudeE7/10000000]));
    newCluster.addLayers(markers);
    cluster?.remove();
    newCluster.addTo(map);
    cluster = newCluster;
  }

  let loaderComponent: Loader;
  const loader = new L.Control({ position: 'topright'});
  loader.onAdd = (map: L.Map) => {
    const target = L.DomUtil.create('div');
    loaderComponent = new Loader({ target, props: {} });
    loaderComponent.$on('locations', onLoadLocations);
    return target;
  }

  function createMap(container: HTMLElement): L.Map {
    return L.map(container, {preferCanvas: true})
      .setView([39.8283, -98.5795], 5)
      .addLayer(L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      ))
      .addControl(loader);
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