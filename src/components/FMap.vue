<template>
  <div id="map" style="height: 400px"></div>
</template>

<script setup lang="ts">
import { Map, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted } from "vue";

export interface FMapProps {
  /**
   * The map initial center coordinates
   */
  center: LngLatLike;
}
const props = defineProps<FMapProps>();

onMounted(() => {
  new Map({
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: props.center,
    zoom: 9,
  });
});
</script>
