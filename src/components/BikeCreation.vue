<template>
    <div class="menu__container mapboxgl-ctrl-top-left">
        <div class="menu__title"><h3 class="">Create new bike</h3></div>
        <div class="menu__body">
            <div class="pop-up__content">
                <div>Serial number:</div>
                <input type="text" v-model="serialNumber" placeholder="8ZIEQGJH">
            </div>
            <div class="pop-up__content">
                <div>In order:</div>
                <v-select
                    :items="[{value: 1, title: 'false'}, {value: 2, title: 'true'}]"
                    v-model="selectedInOrder"
                    return-object
                ></v-select>
            </div>
            <div class="pop-up__content">
                <div>Battery level:</div>
                <input type="text" v-model="batteryLevel" placeholder="25">
            </div>
            <div class="pop-up__content">
                <div>Service status:</div>
                <v-select
                    :items="[{value: 1, title: 'Free'}, {value: 2, title: 'Booked'}, {value: 3, title: 'In use'}]"
                    v-model="serviceStatusSelected"
                    return-object
                ></v-select>
            </div>
            <div class="pop-up__content">
                <div>coordinates:</div>
                <input type="text" v-model="latLng" placeholder="48.875, 2.3352">
            </div>
            <v-btn
                class="pop-up__save-btn"
                color="pink"
                :disabled="!hasChanges"
                @click="clickOnSaveButton"
            >
                SAVE
            </v-btn>
            <p v-for="(error) in errorMessage">
                {{error}}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch, defineEmits } from 'vue';
import { useAddBike } from "../composition/fetcher";

const { addBike } = useAddBike();

const serialNumber = ref<string>();
const batteryLevel = ref<string>();
const latLng = ref<string>();
const selectedInOrder = ref<{value: number, title: string}>();
const serviceStatusSelected = ref();

const hasChanges = ref(false);
const errorMessage = ref<Array<string>>([]);
const emit = defineEmits(['addBike']);

function validateForm() {
    errorMessage.value = [];

    const battery = parseInt(batteryLevel.value!, 10);
    if (!Number.isInteger(battery) ||
        (battery < 0 || battery > 100)) {
        errorMessage.value.push('Battery level should be between 0 and 100');
    }
}

async function clickOnSaveButton() {
    validateForm();

    const data = {
        serial_number: serialNumber.value,
        in_order: selectedInOrder.value!.title,
        service_status: serviceStatusSelected.value.value,
        battery_level: batteryLevel.value,
        coordinates: latLng.value?.split(','),
    };

    await addBike(data);
    emit('addBike');
}

watch([serialNumber, selectedInOrder, serviceStatusSelected, batteryLevel, latLng],
    ([newSerialNumber, newSelectedInOrder, newServiceStatusSelected, newBatteryLevel, newLatLng]) => {

    if (newSerialNumber && newBatteryLevel &&
        newLatLng && newSelectedInOrder && newServiceStatusSelected)
    {
        hasChanges.value = true;
    } else {
        hasChanges.value = false;
    }
});

</script>

<style>
.menu-button {
    margin-top: 15px;
    margin-left: 15px;
    cursor: pointer;
    background-color: #fff;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%);
}

.menu__container {
    pointer-events: auto; /* Force focus on control and not map */
    width: 255px;
    margin-left: 15px;
    margin-top: 15px;
    box-shadow: 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%);
}

.menu__title {
    height: 32px;
    background-color: #30d3b5;
    color: #fff;
    padding-top: 3px;
    padding-left: 55px;
}

.menu__body {
    background-color: #fff;
    padding: 20px;
    font-size: 12px;
}

</style>
