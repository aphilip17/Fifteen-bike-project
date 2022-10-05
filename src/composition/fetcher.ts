import { GeoJsonProperties, Geometry } from "geojson";
import { ref } from "vue";

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
            console.log(json, 'JSON');
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
        type: "FeatureCollection",
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
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [data.coordinates[1], data.coordinates[0]]
                },
            "properties": {
            "id": data.id,
            "serial_number": data.serial_number,
            "coordinates": data.coordinates,
            "in_order": data.in_order,
            "service_status": data.service_status,
            "battery_level": data.battery_level
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
                method: "PUT",
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
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const resp = await response.json();
            /* XXX: POST method does not create unique identifyer. So id is NaN. Data type response is not formatted. */

        } catch (e) {
            error.value = 'Error when adding new bike';
        }
    }

    return {
        addBike,
    }
}



const dataBike = '{"bikes":[{"id":"dba92539966ee00ca53ea4fe","serial_number":"2M8VE2","coordinates":[48.853503928967804,2.1082391527987454],"in_order":true,"service_status":3,"battery_level":56},{"id":"0cc2a7ddc8772e1d4a4d3fd4","serial_number":"YGZ5G4","coordinates":[48.86223254591513,2.3586635654075487],"in_order":true,"service_status":3,"battery_level":22},{"id":"ad10bb55f8541c99156c4476","serial_number":"C2UJTY","coordinates":[48.84475727052398,2.3504727727232817],"in_order":true,"service_status":2,"battery_level":2},{"id":"cc8d2bbc35c5a70f4a5c0032","serial_number":"PUR7XG","coordinates":[48.893670174382464,2.297291891334699],"in_order":true,"service_status":2,"battery_level":35},{"id":"c1323d9b8807d98e81c308dc","serial_number":"MXCSSU","coordinates":[48.92527289566684,2.4915464967889056],"in_order":true,"service_status":2,"battery_level":44},{"id":"dedf588b0e87a58516e8325c","serial_number":"WVE106","coordinates":[48.86070706979661,2.344793392935262],"in_order":true,"service_status":2,"battery_level":76},{"id":"ee879016e20a5a28fd67f220","serial_number":"29A02N","coordinates":[48.864736485962865,2.3503570235079514],"in_order":true,"service_status":2,"battery_level":99},{"id":"4afc2534e0d86f5a79eb9def","serial_number":"RFHPOZ","coordinates":[48.726841704036296,2.2393793388804886],"in_order":true,"service_status":3,"battery_level":56},{"id":"c397b7b8781e1983dc5dbebd","serial_number":"E4DU3Y","coordinates":[48.86878116545777,2.404202262648954],"in_order":true,"service_status":2,"battery_level":80000000},{"id":"536c13300980ba2e53b1f0c2","serial_number":"ABQ24U","coordinates":[48.87648084891762,2.2635403049893568],"in_order":true,"service_status":3,"battery_level":62},{"id":"6098ec1068026eca64f59577","serial_number":"K8NF62","coordinates":[48.852889900158026,2.353784581669024],"in_order":true,"service_status":3,"battery_level":79},{"id":"2f1542eb45ee95c74bcb128a","serial_number":"G3CC2E","coordinates":[48.84482760149325,2.3343939890665975],"in_order":true,"service_status":3,"battery_level":67},{"id":"7ae0598180893c2bf5c35fda","serial_number":"9Z4TSY","coordinates":[48.889737090493036,2.312075921927375],"in_order":true,"service_status":2,"battery_level":9},{"id":"205f8787833038389f100250","serial_number":"P13ZWD","coordinates":[48.78679214507595,2.3622313192520705],"in_order":true,"service_status":2,"battery_level":91},{"id":"f0e38893aa9b50a09a25db26","serial_number":"DRWUYM","coordinates":[48.85194481353814,2.1994513108010083],"in_order":false,"service_status":1,"battery_level":38},{"id":"47448f96d17cb5bdeeb8002e","serial_number":"2FRRM0","coordinates":[48.8579773274084,2.3466479519702856],"in_order":true,"service_status":1,"battery_level":57},{"id":"918117c273bf27c1ca0617d6","serial_number":"4CYY4V","coordinates":[48.78335077069636,2.165380566955861],"in_order":true,"service_status":3,"battery_level":58},{"id":"2802d3376026cc6bd92fea62","serial_number":"KQWK88","coordinates":[48.825841759020044,2.295751014826524],"in_order":true,"service_status":3,"battery_level":45},{"id":"887438fc339b53245ddf7b0a","serial_number":"RKH3SW","coordinates":[48.85348736997281,2.328224796732304],"in_order":true,"service_status":3,"battery_level":9},{"id":"44ced69945f6510321ef4fe0","serial_number":"KEV8B0","coordinates":[48.92860602301375,2.49451447343835],"in_order":false,"service_status":1,"battery_level":65},{"id":"b709f3dcd582d2cb95984e86","serial_number":"MNUTSU","coordinates":[48.863646499863734,2.40955065775842],"in_order":true,"service_status":1,"battery_level":60},{"id":"98237a33ebf5ececa80a1926","serial_number":"SRZVEG","coordinates":[48.71363684453911,2.177286101200525],"in_order":true,"service_status":2,"battery_level":42},{"id":"9757964a3b4a5abc408d9f51","serial_number":"U73M5T","coordinates":[48.869078254738234,2.3449922117553146],"in_order":false,"service_status":1,"battery_level":68},{"id":"9d0ee3a244b48abd261af556","serial_number":"8ZIEQG","coordinates":[48.74932099957554,2.5819248442912897],"in_order":false,"service_status":2,"battery_level":80000000},{"id":"7ff7184d5ef1d8d18a84656b","serial_number":"0AMYPQ","coordinates":[48.88212794480718,2.327748137353509],"in_order":true,"service_status":3,"battery_level":75},{"id":"6eef2a408d736a286f4f78d3","serial_number":"8V55GP","coordinates":[48.85779038889338,2.356563452516853],"in_order":true,"service_status":3,"battery_level":65},{"id":"646f7e8698f00cf982d01fe0","serial_number":"9BRBI4","coordinates":[48.777418968293844,2.3869503757085524],"in_order":true,"service_status":2,"battery_level":50.727261629971586},{"id":"4afb4cbb1c140d5ee5e8acba","serial_number":"D6LYMY","coordinates":[48.89621099265782,2.384145534938614],"in_order":true,"service_status":2,"battery_level":3},{"id":"6f0334ef2d42124fd1ecce3c","serial_number":"6Y58H1","coordinates":[48.86643774250517,2.3259500771423354],"in_order":true,"service_status":3,"battery_level":76},{"id":"3ebb2473843c191a2eebc8f1","serial_number":"88V9B8","coordinates":[48.86782692470894,2.3490569145625853],"in_order":true,"service_status":1,"battery_level":34},{"id":"0f01d68ea0a9561f37361291","serial_number":"0REOZO","coordinates":[48.9617330611637,2.228331017125356],"in_order":true,"service_status":3,"battery_level":94},{"id":"d49624b19ae4fd1ee4073f16","serial_number":"L0V1WO","coordinates":[48.87578758676205,2.3557427457909674],"in_order":true,"service_status":3,"battery_level":74},{"id":"d4831a52bc6c4b02987e3a3e","serial_number":"AN3LT7","coordinates":[48.81569479637784,2.144850322863146],"in_order":true,"service_status":1,"battery_level":44},{"id":"ffb6ffd53a78dc624121b3ac","serial_number":"U0J56I","coordinates":[48.871520649541424,2.052236241160709],"in_order":true,"service_status":3,"battery_level":63.44315962357955},{"id":"14e3dc5074f1b8600aba284f","serial_number":"PYTH6J","coordinates":[48.86433097594684,2.3496360451265006],"in_order":true,"service_status":1,"battery_level":39},{"id":"9d621c497934274cccaed36b","serial_number":"C1H15G","coordinates":[48.875537594817494,2.3364410923335734],"in_order":true,"service_status":3,"battery_level":66},{"id":"e74e0944e1df7cec9abf165d","serial_number":"5TDCB3","coordinates":[48.868074770317676,2.347320258841637],"in_order":true,"service_status":3,"battery_level":21},{"serial_number":"hg","coordinates":[48.877212538791895,2.577337637926348],"in_order":false,"service_status":1,"battery_level":18.75,"id":"NaN"},{"serial_number":"bbvbv","coordinates":[48.90923523579332,2.27230379541615],"in_order":false,"service_status":1,"battery_level":0,"id":"NaN"},{"serial_number":"2M8VE9","coordinates":[48.853503928967804,2.1082391527987454],"in_order":true,"service_status":3,"battery_level":56,"id":"NaN"},{"serial_number":"2M8VP9","coordinates":[-122.414,37.776],"in_order":true,"service_status":3,"battery_level":56,"id":"NaN"},{"serial_number":"2M8VP9","coordinates":[-77.032,38.913],"in_order":true,"service_status":3,"battery_level":56,"id":"NaN"},{"serial_number":"2M8VP9","coordinates":[-77.032,38.913],"in_order":true,"service_status":3,"battery_level":56,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":68,"battery_level":100,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":33,"battery_level":94,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":75,"battery_level":83,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":5,"battery_level":16,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":63,"battery_level":60,"id":"NaN"},{"serial_number":"serial_number NaN","coordinates":[],"in_order":false,"service_status":46,"battery_level":12,"id":"NaN"}],"total":49}';