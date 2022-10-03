<template>
    <div id="map" style="height: 100%"></div>
</template>

<script setup lang="ts">

import { Map, LngLatLike, Popup, MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
/* @ts-ignore */
import vuetify from '../plugins/vuetify';
import { onMounted, onUnmounted, watch, createApp, ref, inject } from "vue";
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
    data,
    fetchBikes
} = useFetchBikes();

let map: Map;
let isMapReady = ref(false);
let isImageLoaded = ref(false);

const busEvent = inject('busEvent');

function addBikesToMap() {
    if (isImageLoaded.value) {
        createLayerSource();
    } else {
        map.loadImage('../images/bicycle.png', (error, image) => {
        if (error) throw error;

        map.addImage('bicycle-icon', image as any, { sdf: true });
            isImageLoaded.value = true;
            createLayerSource();
        });
    }
};


function createLayerSource() {
    if (map.getLayer('bikes-layer')) {
        map.removeLayer('bikes-layer');
    }
    if (map.getSource('bikes')) {
        map.removeSource('bikes');
    }

    map.addSource('bikes', {
        type: 'geojson',
        data: data.value
    });

    map.addLayer({
        'id': 'bikes-layer',
        'source': 'bikes',
        'type': 'symbol',
        'layout': {
        'icon-image': 'bicycle-icon',
        'icon-size': 0.05
        },
        'paint': {
            'icon-color': [
                'match',
                ['get', 'service_status'], /* Use the result 'service_status' property */
                1,
                '#008000',
                2,
                '#FF8C00',
                3,
                '#CC0000' ,
                '#000000' /* Fallback */
            ]
        }
    });
}

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

    const popUpProps = features[0].properties!;
    createApp(PopUpComponent, {...popUpProps, busEvent: busEvent})
        .use(vuetify)
        .mount('#popup-content');
};


onMounted(() => {
    fetchBikes();
    map = new Map({
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
        container: 'map',
        style: "mapbox://styles/mapbox/light-v10",
        center: props.center,
        zoom: 9,
    });

    map.on("click", addPopUp);
    map.on('load', function() {
        isMapReady.value = true;
    });

    (busEvent as any).on('updateBikeAttributes', () => {
        fetchBikes();
    });
});

onUnmounted(() => {
    map.off("click", addPopUp);
    (busEvent as any).off();
});

watch([data, isMapReady], () => {
    if (!isMapReady.value || !data.value) {
        return;
    }
    addBikesToMap();
    console.log(data);
});

</script>
