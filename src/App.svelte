<script lang="ts">
  import dayjs from "dayjs";
  import L from 'leaflet';
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  import 'leaflet.markercluster';
  import {MarkerClusterGroup} from 'leaflet';
  import {DataMarker} from "./marker";
  import Loader from "./components/Loader.svelte";
  import Slider from "./components/Slider.svelte";
  import {filterMarkers} from "./utils";

  let map: L.Map;
  let cluster: MarkerClusterGroup;
  let markers: DataMarker[] = [];

  const filter = {s: dayjs().set('year', 2017).set('month', 1), e: dayjs().set('year', 2017).set('month', 12)};

  function onLoadLocations(event: CustomEvent<GeoLocation[]>) {
    cluster?.remove();
    markers = DataMarker.fromGeoLocations(event.detail);
    cluster = new MarkerClusterGroup().addTo(map);
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

  function onRangeChange(e: CustomEvent) {
    console.log(e.detail);
    updateMarkerLayer();
  }

  let sliderComponent: Slider;
  const slider = new L.Control({position: "bottomleft"});
  slider.onAdd = (_: L.Map) => {
    const target = L.DomUtil.create('div');
    L.DomEvent.disableClickPropagation(target);
    sliderComponent = new Slider({target, props: {min: 0, max: 1}});
    sliderComponent.$on('change', onRangeChange);
    return target;
  }

  function createMap(container: HTMLElement): L.Map {
    return L.map(container, {preferCanvas: true})
      .setView([39.8283, -98.5795], 5)
      .addLayer(L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      ))
      .addControl(loader)
      .addControl(slider);
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

  function updateMarkerLayer() {
    if (!map || !cluster) return;
    const {show, hide} = filterMarkers(filter, markers);
    console.log(show);
    cluster.removeLayers(hide.filter(l => cluster.hasLayer(l)));
    cluster.addLayers(show.filter(l => !cluster.hasLayer(l)));
  }
</script>

<div class="map" use:mapAction></div>

<style>
  .map {
      height: 100%;
      width: 100%;
  }
</style>