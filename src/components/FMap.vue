<template>
    <div id="map" style="height: 100%"></div>
</template>

<script setup lang="ts">

import { Map, LngLatLike, Popup, MapMouseEvent } from "mapbox-gl";
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
    map.addSource('bikes', {
        type: 'geojson',
        data: data.value
    });

    map.addLayer({
        'id': 'bikes-layer',
        'type': 'circle',
        'source': 'bikes',
        'paint': {
            'circle-radius': 4,
            'circle-stroke-width': 2,
            'circle-color': 'red',
            'circle-stroke-color': 'white'
        }
    });
};

function addPopUp(e: MapMouseEvent) {
    const features = map.queryRenderedFeatures(e.point, {
            layers: ['bikes-layer']
        });

    if (!features.length) {
        return;
    }

    const coordinates = (features[0].geometry as GeoJSON.Point).coordinates;
    const popUp = new Popup();

    popUp
        .setLngLat(coordinates as LngLatLike)
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
    map.off("click", "earthquakes-layer", addPopUp);
});

watch(() => data.value, (data) => {
    addBikesToMap();
  console.log(data);
});

</script>
