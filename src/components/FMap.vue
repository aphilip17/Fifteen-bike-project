<template>
    <div id="map" style="height: 100%"></div>
</template>

<script setup lang="ts">

import { Map, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onBeforeMount, onMounted } from "vue";
import { useFetchBikes } from "../composition/fetcher";

export interface FMapProps {
    /**
     * The map initial center coordinates
     */
    center: LngLatLike;
}

const props = defineProps<FMapProps>();

const {
    loading,
    data,
    error,
    fetchBikes
} = useFetchBikes();

onBeforeMount(() => {
    fetchBikes();
    console.log(loading);
    console.log(error);
    console.log(data);
});

onMounted(async () => {
    new Map({
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        center: props.center,
        zoom: 9,
    });
});

</script>
