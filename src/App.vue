<template>
  <v-app>
    <v-main>
      <FMap :center="mapCenter" />
    </v-main>
  </v-app>
</template>

<script setup lang='ts'>
import FMap from '@/components/FMap.vue';

const mapCenter = { lat: 48.864716, lng: 2.349014 };
</script>
