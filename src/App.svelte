<script lang="ts">
  import L from 'leaflet';
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  import 'leaflet.markercluster';
  import {MarkerClusterGroup} from 'leaflet';
  import {DataMarker} from "./marker";
  import Loader from "./components/Loader.svelte";
  import Slider from "./components/Slider.svelte";
  import {createFilter, filterMarkers, findBounds} from "./utils";
  import {range} from "./store";
  import type {GeoLocation} from "./logic/parsing";

  const cluster = new MarkerClusterGroup();
  let map: L.Map | undefined;
  let markers: DataMarker[] = [];

  function onLoadLocations(event: CustomEvent<GeoLocation[]>) {
    cluster.clearLayers();
    markers = DataMarker.fromGeoLocations(event.detail);
    $range = findBounds(markers);
  }

  let loaderComponent: Loader;
  const loader = new L.Control({position: 'topright'});
  loader.onAdd = (_: L.Map) => {
    const target = L.DomUtil.create('div');
    L.DomEvent.disableClickPropagation(target);
    loaderComponent = new Loader({target, props: {}});
    loaderComponent.$on('locations', onLoadLocations);
    return target;
  }

  let sliderComponent: Slider;
  const slider = new L.Control({position: "bottomleft"});
  slider.onAdd = (_: L.Map) => {
    const target = L.DomUtil.create('div');
    L.DomEvent.disableClickPropagation(target);
    sliderComponent = new Slider({target, props: {}});
    sliderComponent.$on('change', (e: CustomEvent<SliderSelection>) => applyFilter(e.detail));
    return target;
  }

  function displayMap(container: HTMLElement) {
    map = L.map(container, {preferCanvas: true})
      .setView([39.8283, -98.5795], 5)
      .addLayer(L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      ))
      .addLayer(cluster)
      .addControl(loader)
      .addControl(slider);

    return {
      destroy: () => {
        map?.remove();
        map = undefined;
      }
    }
  }

  function applyFilter(selection: SliderSelection) {
    if (!map || !cluster) return;
    const filter = createFilter($range, selection);
    const {show, hide} = filterMarkers(filter, markers);
    cluster.removeLayers(hide.filter(l => cluster.hasLayer(l)));
    cluster.addLayers(show.filter(l => !cluster.hasLayer(l)));
  }
</script>

<div class="map" use:displayMap></div>

<style>
  .map {
      height: 100%;
      width: 100%;
  }
</style>