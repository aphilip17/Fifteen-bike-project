<template>
    <div class="input__container">
        <div>Serial number:</div>
        <input type="text" v-model="serialNumber">
    </div>
    <div class="input__container">
        <div>In order:</div>
        <v-select
            :items="[{value: false, title: 'false'}, {value: true, title: 'true'}]"
            v-model="selectedInOrder"
        ></v-select>
    </div>
    <div class="input__container">
        <div>Battery level:</div>
        <input type="text" v-model="batteryLevel">
    </div>
    <div class="input__container">
        <div>Service status:</div>
        <v-select
            :items="[{value: 1, title: 'Free'}, {value: 2, title: 'Booked'}, {value: 3, title: 'In use'}]"
            v-model="serviceStatusSelected"
            return-object
        ></v-select>
    </div>
    <v-btn
        class="save-btn"
        color="pink"
        :disabled="!hasChanges"
        @click="clickOnSaveButton"
    >
        SAVE
    </v-btn>
</template>

<script setup lang='ts'>

import { ref, watch } from 'vue';
import { useUpdateBikeAttributes } from '../composition/fetcher';

type VSelectOpts = {
    value: number;
    title: string
}

const props = defineProps<{
    id: string;
    serial_number: string;
    coordinates: string;
    in_order: boolean | string;
    service_status: number;
    battery_level: number | string;
    busEvent: any; /* XXX: Should be typed */
}>();

const {
    updateBikeAttributes
} = useUpdateBikeAttributes(props.id);

const serialNumber = ref(props.serial_number);
const batteryLevel = ref(props.battery_level);

let hasChanges = ref(false);
let selectedInOrder = ref(props.in_order);
let serviceStatusSelected = ref<VSelectOpts | number>(props.service_status);

watch([serialNumber, selectedInOrder, serviceStatusSelected, batteryLevel], () => {
    hasChanges.value = true;
});

async function clickOnSaveButton() {
    hasChanges.value = false;
    const updatedData = {
        serial_number: serialNumber.value,
        in_order: selectedInOrder.value,
        service_status: (serviceStatusSelected.value as VSelectOpts).value,
        battery_level: batteryLevel.value,
    };
    await updateBikeAttributes(updatedData);
    props.busEvent.emit('updateBikeAttributes');
}

</script>
