import { IGeoJSON } from "../types";

export const getNamesFromGeojson = (geoJson: IGeoJSON): string[] => geoJson.features.map(v => v.properties.name);

export const mkValueData = (names: string[]) => names.map(v => ({
    name: v,
    value: 0
}))