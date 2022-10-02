import { ref } from "vue";

interface FetchModel {
    bikes: BikeModel[];
    total: number;
}

export interface BikeModel {
    serial_number: string;
    coordinates: [number, number];
    in_order: boolean;
    service_status: number;
    battery_level: number; // from 0 to 100%
}

export function useFetchBikes() {
    const loading = ref(false);
    const data = ref<FetchModel>();
    const error = ref('');

    const fetchBikes = async () => {
        loading.value = true;
        try {
            const response = await fetch('https://629b3242656cea05fc354d33.mockapi.io/bikes');
            data.value = await response.json();
        } catch (e) {
            error.value = 'Something went wrong when data loading';
        }

        loading.value = false;
    }

    return {
        loading,
        data,
        error,
        fetchBikes,
    }
}