<template>
    <div class="radio-button__container mapboxgl-ctrl-top-right">
        <div
            v-for="option in options">
            <label
                :for="option"
            >
                <input
                    type="radio"
                    name="radio-input"
                    :value="option"
                    v-model="checked"
                    @change="emit('change', option)"
                />
            {{ option }}
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">

import { defineEmits } from 'vue';
export interface RadioButtonProps {
    options: Array<string>;
    checked: string;
}

const emit = defineEmits(['change']);
defineProps<RadioButtonProps>();

</script>

<style>
    .radio-button__container {
        pointer-events: auto; /* Force focus on control and not map */
        margin-right: 15px;
        margin-top: 15px;
        cursor: pointer;
        border: none;
        background-color: #fff;
        width: 120px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        box-shadow: 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%);
}

</style>