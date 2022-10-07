import { GeoJsonProperties, Geometry } from 'geojson';
import { ref } from 'vue';

export interface BikeModel {
    id: string;
    serial_number: string;
    coordinates: [number, number];
    in_order: boolean;
    service_status: number;
    battery_level: number; // from 0 to 100%
}

export function useFetchBikes() {
    const loading = ref(false);
    const data = ref<GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>>();
    const error = ref('');

    const fetchBikes = async function () {
        loading.value = true;

        try {
            const response = await fetch('https://629b3242656cea05fc354d33.mockapi.io/bikes');
            const json = await response.json();
            data.value = transformToGeojson(json.bikes);
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

function transformToGeojson(datas: BikeModel[]) {
    const geojson: any = {
        type: 'FeatureCollection',
        features: [],
    };

    for (let i = 0; i < datas.length; i++) {
        const data = datas[i];
        /* Coordinates should be defined. */
        const hasCoordinates = data.coordinates.length;
        /* Invalid LngLat latitude value: must be between -90 and 90 */
        const isLatitudeValid = data.coordinates[0] < 90 && data.coordinates[0] > -90;

        /* Clean data */
        if (!hasCoordinates || !isLatitudeValid) {
            continue;
        }

        geojson.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [data.coordinates[1], data.coordinates[0]]
            },
            properties: {
                id: data.id,
                serial_number: data.serial_number,
                coordinates: data.coordinates,
                in_order: data.in_order,
                service_status: data.service_status,
                battery_level: data.battery_level
            }
        });
    }

    return geojson;
}

export function useUpdateBikeAttributes(id: string) {
    const data = ref<BikeModel>();
    const error = ref('');
    const updateBikeAttributes = async (updatedData: any) => { /* TODO: Type */
        try {
            const response = await fetch('https://629b3242656cea05fc354d33.mockapi.io/bikes/' + id, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            data.value = await response.json();

        } catch (e) {
            error.value = 'Error when updating data';
        }
    }

    return {
        data,
        error,
        updateBikeAttributes,
    }
}

export function useAddBike() {
    const error = ref('');
    const addBike = async (data: any) => { /* TODO: Type */
        try {
            const response = await fetch('https://629b3242656cea05fc354d33.mockapi.io/bikes/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            await response.json();
            /* XXX: POST method does not create unique identifyer. So id is NaN. Data type response is not formatted. */

        } catch (e) {
            error.value = 'Error when adding new bike';
        }
    }

    return {
        addBike,
    }
}
