<template>
    <div id="map" style="height: 100%"></div>
</template>

<script setup lang="ts">

import { Map, LngLatLike, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onBeforeMount, onMounted, onUnmounted, watch, createApp, defineComponent } from "vue";
import PopUpComponent from "./PopUp.vue";
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

let map: Map;


function addBikesToMap() {
    for (const bike of data.value!.bikes) {
        const coords = bike.coordinates;
        /* 'Coordinates must be defined' */
        if (bike.coordinates.length &&
            /* 'Invalid LngLat latitude value: must be between -90 and 90' */
            bike.coordinates[0] < 90 && bike.coordinates[0] > -90 ) {
            const marker = new Marker();
            marker
                .setLngLat([coords[1], coords[0]])
                .addTo(map)
                .setPopup()
        }
    }
};

function addPopUp(e: any) {
    const popUp = new Popup();

    popUp
        .setLngLat(e.lngLat)
        .setHTML('<div id="popup-content"></div>')
        .addTo(map);

    const MyNewPopup = defineComponent({
        extends: PopUpComponent,
        setup() {
            const title = 'Test'
            return { title }
        },
    });
    createApp(MyNewPopup).mount('#popup-content');
};

onBeforeMount(() => {
    fetchBikes();
    console.log(loading);
    console.log(error);
    console.log(data);
});

onMounted(() => {
    map = new Map({
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
        container: 'map',
        style: "mapbox://styles/mapbox/light-v10",
        center: props.center,
        zoom: 9,
    });

    map.on("click", addPopUp);
});

onUnmounted(() => {
    map.off("click", addPopUp);
});

watch(() => data.value, (data) => {
    addBikesToMap();
  console.log(data);
});

</script>
